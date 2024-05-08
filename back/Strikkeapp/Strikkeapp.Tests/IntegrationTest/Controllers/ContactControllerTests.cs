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
using Strikkeapp.Data.Dto;


namespace Strikkeapp.Tests.Controllers;

public class ContactControllerTests
{
    // Initialize db, controller and services
    private readonly ContactController _controller;
    private readonly ContactService _contactService;
    private readonly StrikkeappDbContext _context;

    // Set up mocks
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    // Test data
    private Guid testUserId = Guid.NewGuid();
    private Guid testAdminId = Guid.NewGuid();
    private Guid testRequestId = Guid.NewGuid();

    public ContactControllerTests()
    {   
        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
            .Returns("hashedPassword");

        _mockTokenService.Setup(x => x.ExtractUserID("adminToken"))
            .Returns(TokenResult.ForSuccess(testAdminId));

        // Set up in memory database
        string databaseName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName)
            .ConfigureWarnings(war => war.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Set up context and service
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _contactService = new ContactService(_context, _mockTokenService.Object);
        _controller = new ContactController(_contactService);

        // Seed database
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add test user to database
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

        // Add test request to database
        _context.ContactRequests.Add(new ContactRequest
        {
            ContactRequestId = testRequestId,
            UserId = testUserId,
            FullName = "Test User",
            Email = "test@user.com",
            Message = "Some message",
        });

        _context.SaveChanges();
    }

    [Fact]
    public void PostRequest_Ok()
    {
        // Create request and call controller
        var request = new ContactRequestDto
        {
            UserEmail = "some@user.com",
            UserMessage = "Some message",
            UserName = "User Name"
        };

        var result = _controller.PostContactRequest(request);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void GetRequests_Ok()
    {
        var allFalse = _controller.GetContactRequests(false, false, "adminToken");
        Assert.IsType<OkObjectResult>(allFalse);

        var allTrue = _controller.GetContactRequests(true, true, "adminToken");
        var response = Assert.IsType<OkObjectResult>(allTrue);
        Assert.Contains("No contact requests found.", response.Value!.ToString());
    }

    [Fact]
    public void UpdateIsActive_Ok()
    {
        // Update request and check if set to active
        var active = _controller.UpdateIsActive(testRequestId, true, "adminToken");
        Assert.IsType<OkObjectResult>(active);

        var request = _context.ContactRequests.Find(testRequestId);
        Assert.True(request!.IsActive);

        // Update request and check if set to inactive
        var inactive = _controller.UpdateIsActive(testRequestId, false, "adminToken");
        Assert.IsType<OkObjectResult>(inactive);

        request = _context.ContactRequests.Find(testRequestId);
        Assert.False(request!.IsActive);
    }

    [Fact]
    public void BadIsActive_Fails()
    {
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Update request that does not exist
        var badRequest = _controller.UpdateIsActive(Guid.NewGuid(), true, "adminToken");
        Assert.IsType<NotFoundResult>(badRequest);

        var badToken = _controller.UpdateIsActive(testRequestId, true, "fakeToken");
        Assert.IsType<NotFoundResult>(badToken);
    }

    
}