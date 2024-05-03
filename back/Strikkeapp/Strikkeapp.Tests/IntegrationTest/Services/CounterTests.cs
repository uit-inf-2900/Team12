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
    private Guid testCounterGuid = Guid.NewGuid();

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

        _context.CounterInventory.Add(new Counter
        {
            CounterId = testCounterGuid,
            Name = "TestCounter",
            UserId = testUserGuid
        });

        _context.SaveChanges();
    }

    [Fact]
    public void CreateCounter_Ok()
    {
        // Set up test data and mock service
        string counterName = "newCounter";
        string testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify result
        var result = _counterService.CreateCounter(testToken, counterName);
        Assert.True(result.Success, "Counter creation failed");
        
        // Verify that the counter was created with correct info
        var counter = _context.CounterInventory
            .FirstOrDefault(c => c.Name == counterName);
        Assert.NotNull(counter);
        Assert.Equal(counterName, counter.Name);
    }

    [Fact]
    public void FakeTokenCreateCounter_Fails()
    {
        // Set up test data and mock service
        string counterName = "newCounter";
        string fakeToken = "fakeToken";

        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run service and verify result
        var result = _counterService.CreateCounter(fakeToken, counterName);
        Assert.False(result.Success, "Counter creation should have failed");
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void UpdateCounter_Ok()
    {
        // Set up test data and mock service
        string name = "newName";
        string testToken = "testToken";
        int newNum = 10;

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify result
        var result = _counterService.UpdateCounter(testToken, testCounterGuid, newNum, name);
        Assert.True(result.Success, "Counter update failed");

        // Verify that the counter was updated with correct info
        var counter = _context.CounterInventory
            .FirstOrDefault(c => c.CounterId == testCounterGuid);
        Assert.NotNull(counter);
        Assert.Equal(name, counter.Name);
        Assert.Equal(newNum, counter.RoundNumber);
    }

    [Fact]
    public void FakeTokenUpdateCounter_Fails()
    {
        // Set up test data and mock service
        string fakeToken = "fakeToken";

        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run service and verify error
        var result = _counterService.UpdateCounter(fakeToken, testCounterGuid, 10, "newName");

        Assert.False(result.Success, "Counter update should have failed");
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void NonCounterUpdateCounter_Fails()
    {
        // Set up test data and mock service
        string testToken = "testToken";
        Guid fakeCounterGuid = Guid.NewGuid();

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify error
        var result = _counterService.UpdateCounter(testToken, fakeCounterGuid, 10, "newName");

        Assert.False(result.Success, "Counter update should have failed");
        Assert.Equal("Not found", result.ErrorMessage);
    }

    [Fact]
    public void DeleteCounter_Ok()
    {
        // Set up test data and mock service
        string testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify result
        var result = _counterService.DeleteCounter(testToken, testCounterGuid);
        Assert.True(result.Success, "Counter deletion failed");

        // Verify that the counter was deleted
        var counter = _context.CounterInventory
            .FirstOrDefault(c => c.CounterId == testCounterGuid);
        Assert.Null(counter);
    }

    [Fact]
    public void GetCounters_Ok()
    {
        // Set up test data and mock service
        string testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify result
        var result = _counterService.GetCounters(testToken);
        Assert.True(result.Success, "Get counters failed");
        Assert.NotEmpty(result.UserCounters);
    }

    [Fact]
    public void FakeTokenGetCounters_Fails()
    {
        // Set up test data and mock service
        string fakeToken = "fakeToken";

        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run service and verify error
        var result = _counterService.GetCounters(fakeToken);

        Assert.False(result.Success, "Get counters should have failed");
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }
}