using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Tests;

public class NewsletterTest : IDisposable
{
    private readonly StrikkeappDbContext _context;
    private readonly INewsletterService _newsletterService;

    // Create mock service
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    private Guid testUserGuid = Guid.NewGuid();
    private Guid testUserGuid2 = Guid.NewGuid();

    public NewsletterTest()
    {
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _newsletterService = new NewsletterService(_context, _mockTokenService.Object);

        // Set up test data in db
        SeedTestData();
    }

    private void SeedTestData()
    {
        // Add entry in newsletter
        var testNewsletterEntry = new Newsletter
        {
            email = "test@example.com"
        };
        _context.Newsletter.Add(testNewsletterEntry);

        // Add admin user
        var adminDetails = new UserDetails
        {
            UserId = testUserGuid,
            UserFullName = "Admin Admin",
            DateOfBirth = DateTime.UtcNow,
            IsAdmin = true
        };
        _context.UserDetails.Add(adminDetails);
        
        // Add non admin
        var nonAdmin = new UserDetails
        {
            UserId = testUserGuid2,
            UserFullName = "Eve Il",
            DateOfBirth = DateTime.UtcNow,
            IsAdmin = false
        };
        _context.UserDetails.Add(nonAdmin);

        _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public void AddSubscriber_Ok()
    {
        string testEmail = "new@example.com";

        var res = _newsletterService.SubscribeToNewsletter(testEmail);

        // Service should succeed and email should be in db
        Assert.True(res.Success, "Adding subscriber failed");

        var emailExists = _context.Newsletter
            .Any(n => n.email == testEmail);

        Assert.True(emailExists, "Subscriber not in database");
    }

    [Fact]
    public void AddingDuplicate_Fails()
    {
        // Adding duplicate should fail
        var res = _newsletterService.SubscribeToNewsletter("test@example.com");

        Assert.False(res.Success);
    }

    [Fact]
    public void RemoveSubscriber_Ok()
    {
        // Set up data and run test
        string testEmail = "test@example.com";
        var res = _newsletterService.RemoveSubscriber(testEmail);

        // Service should succeed and email should be deleted
        Assert.True(res.Success);

        var emailExsits = _context.Newsletter
            .Any(n => n.email == testEmail);

        Assert.False(emailExsits, "Email should be deleted");
    }

    [Fact]
    public void RemoveNonSubsciber_Fails()
    {
        // Set up and run test
        string nonEmail = "doesNot@exsist.com";
        var res = _newsletterService.RemoveSubscriber(nonEmail);

        // Removing non existing email should fail
        Assert.False(res.Success);
    }

    [Fact]
    public void GetSubs_Ok()
    {
        // Set up test
        string testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run test
        var res = _newsletterService.GetUsers(testToken);

        // Admin should get non empty list
        Assert.True(res.Success);
        Assert.NotEmpty(res.Subscribers);
    }
    [Fact]
    public void FakeToken_Fails()
    {
        // Set up test
        string fakeToken = "fakeToken";
        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
                    .Returns(TokenResult.ForFailure("Invalid token"));

        // Run test and verify error
        var res = _newsletterService.GetUsers(fakeToken);

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void NonAdmin_GetFails()
    {
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForSuccess(testUserGuid2));

        var res = _newsletterService.GetUsers(testToken);

        // Service should fail for non admin
        Assert.False(res.Success);
    }
}