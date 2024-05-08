using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

using Strikkeapp.Controllers;
using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;
using Strikkeapp.Data.Entities;


namespace Strikkeapp.Tests.Controllers;

public class NewsletterControllerTests
{
    // Set up db, controller and service
    private readonly NewsletterController _controller;
    private readonly NewsletterService _newsletterService;
    private readonly StrikkeappDbContext _context;

    // Set up mocks
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    // Test variables
    private Guid testAdminId = Guid.NewGuid();
    private Guid testUserId = Guid.NewGuid();

    public NewsletterControllerTests()
    {
        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
            .Returns("hashedPassword");

            // Set up in memory database
        string databaseName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName)
            .ConfigureWarnings(war => war.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _newsletterService = new NewsletterService(_context, _mockTokenService.Object);
        _controller = new NewsletterController(_newsletterService);


        // Set up db with test data
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add regular user to database
        _context.UserLogIn.Add(new UserLogIn
        {
            UserId = testUserId,
            UserEmail = "test@user.com",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        });
        _context.UserDetails.Add(new UserDetails
        {
            UserId = testUserId,
            UserFullName = "Test User",
            DateOfBirth = DateTime.Now,
            IsAdmin = false
        });

        // Add test admin to database
        _context.UserLogIn.Add(new UserLogIn
        {
            UserId = testAdminId,
            UserEmail = "admin@knithub.no",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        });

        _context.UserDetails.Add(new UserDetails
        {
            UserId = testAdminId,
            UserFullName = "Admin User",
            DateOfBirth = DateTime.Now,
            IsAdmin = true
        });
        
        _context.Newsletter.Add(new Newsletter
        {
            email = "subscriber@email.com"
        });

        _context.SaveChanges();
    }

    [Fact]
    public void AddSubsciber_Ok()
    {
        // Call controller and verify success
        var result = _controller.AddSubscriber("new@subscriber.com");
        Assert.IsType<OkObjectResult>(result);

        // Verify that the subscriber was added to the database
        var subscriber = _context.Newsletter.Find("new@subscriber.com");
        Assert.NotNull(subscriber);
    }

    [Fact]
    public void AddDuplicate_Fails()
    {
        // Call controller and verify conflict
        var result = _controller.AddSubscriber("subscriber@email.com");
        var duplicateRes = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal("Email is already in subscribed", duplicateRes.Value);
    }

    [Fact]
    public void RemoveSubsciber_Ok()
    {
        // Call controller and verify success
        var result = _controller.RemoveSubscriber("subscriber@email.com");
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void RemoveNonExisting_Fails()
    {
        // Call controller and verify response
        var result = _controller.RemoveSubscriber("some@email.com");
        var nfRes = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("Email not found in subsciption list", nfRes.Value);
    }

    [Fact]
    public void GetSubscribers_Ok()
    {
        _mockTokenService.Setup(x => x.ExtractUserID("adminToken"))
            .Returns(TokenResult.ForSuccess(testAdminId));

        // Call controller and verify response
        var result = _controller.GetSubscibers("adminToken");
        var okRes = Assert.IsType<OkObjectResult>(result);
        var subscribers = Assert.IsType<List<string>>(okRes.Value);
        Assert.Single(subscribers);
    }

    [Fact]
    public void NonAdminGet_Fails()
    {
        _mockTokenService.Setup(x => x.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(testUserId));

        // Call controller and verify response
        var result = _controller.GetSubscibers("userToken");
        var forbiddenRes = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("User not allowed to see subscribers", forbiddenRes.Value);
    }
}