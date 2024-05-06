using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Moq;

using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Data.Dto;

namespace Strikkeapp.Tests.Services;

public class ContactTests : IDisposable
{
    // Set up db and service to test
    private readonly StrikkeappDbContext _context;
    private readonly ContactService _contactService;

    // Create mock service
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    public ContactTests()
    {
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");
        
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);

        _contactService = new ContactService(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public void CreateNewRequest_Ok()
    {
        var request = new ContactRequestDto
        {
            UserEmail = "test@example.com",
            UserMessage = "Test message",
            UserName = "Test User",
        };

        var result = _contactService.CreateContactRequest(request);
        Assert.NotEmpty(result.ToString());
    }

}