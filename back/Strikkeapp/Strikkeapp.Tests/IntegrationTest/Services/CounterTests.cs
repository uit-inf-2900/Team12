using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Moq;

using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Tests;

public class CounterTests
{
    private readonly StrikkeappDbContext _context;
    private readonly CounterService _counterService;

    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    private Guid testUserGuid = Guid.NewGuid();

    public CounterTests()
    {
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

        // Set up in memory database
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: "UserServiceDb")
            .ConfigureWarnings(war => war.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Set up context and service
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);

        _counterService = new CounterService(_context, _mockTokenService.Object);

        SeedTestData();
    }

    private void SeedTestData()
    {
        _context.UserLogIn.Add(new UserLogIn
        {
            UserId = Guid.NewGuid(),
            UserEmail = "test@example.com",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        });

        _context.SaveChanges();
    }

    [Fact]
    public void CreateCounter_Ok()
    {
        string counterName = "TestCounter";
        string testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var result = _counterService.CreateCounter(testToken, counterName);

        Assert.True(result.Success, "Counter creation failed");
        
        var counter = _context.CounterInventory
            .FirstOrDefault(c => c.Name == counterName);
        Assert.NotNull(counter);
        Assert.Equal(counterName, counter.Name);
    }
}