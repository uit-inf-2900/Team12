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

    private Guid testUserId = Guid.NewGuid();
    private Guid adminUserId = Guid.NewGuid();
    private Guid testRequestId = Guid.NewGuid();

    public ContactTests()
    {
        // Set up password hasher
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

        _mockTokenService.Setup(x => x.ExtractUserID("testToken"))
            .Returns(TokenResult.ForSuccess(testUserId));
        _mockTokenService.Setup(x => x.ExtractUserID("adminToken"))
            .Returns(TokenResult.ForSuccess(adminUserId));

        
        // Set up in memory db
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);

        // Set up service
        _contactService = new ContactService(_context, _mockTokenService.Object);
        
        // Seed db with test data
        SeedTestData();
    }

    private void SeedTestData()
    {
        // Test user
        var login = new UserLogIn
        {
            UserId = testUserId,
            UserEmail = "user@knithub.no",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        };
        _context.UserLogIn.Add(login);
        
        _context.UserDetails.Add(new UserDetails
        {
            UserId = testUserId,
            UserFullName = "Test User",
            DateOfBirth = DateTime.Now,
            IsAdmin = false
        });

        // Set up admin user
        var loginAdmin = new UserLogIn
        {
            UserId = adminUserId,
            UserEmail = "admin@knithub.no",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        };
        _context.UserLogIn.Add(loginAdmin);

        var detailsAdmin = new UserDetails
        {
            UserId = adminUserId,
            UserFullName = "Admin User",
            DateOfBirth = DateTime.Now,
            IsAdmin = true
        };
        _context.UserDetails.Add(detailsAdmin);

        // Add test contact requests
        var req1 = new ContactRequest
        {
            ContactRequestId = testRequestId,
            FullName = "Test User",
            Email = "test@example.com",
            Message = "Test message",
            TimeCreated = DateTime.Now,
        };
        _context.ContactRequests.Add(req1);

        var req2 = new ContactRequest
        {
            FullName = "Some User",
            Email = "someone@example.com",
            Message = "Some message",
            IsActive = true
        };
        _context.ContactRequests.Add(req2);

        var req3 = new ContactRequest
        {
            FullName = "Some User",
            Email = "someone@example.com",
            Message = "Ishandled",
            IsHandled = true
        };
        _context.ContactRequests.Add(req3);

        var req4 = new ContactRequest
        {
            FullName = "Some User",
            Email = "someone@example.com",
            Message = "Everything is true",
            IsActive = true,
            IsHandled = true
        };
        _context.ContactRequests.Add(req4);

        _context.SaveChanges();
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

    [Fact]
    public void GetRequest_Ok ()
    {
        // Run tests and check result
        // Should only return one request
        var result1 = _contactService.GetContactRequests(false, false, "adminToken");
        Assert.Single(result1);

        var result2 = _contactService.GetContactRequests(true, false, "adminToken");
        Assert.Single(result2);

        var result3 = _contactService.GetContactRequests(false, true, "adminToken");
        Assert.Single(result3);

        var result4 = _contactService.GetContactRequests(true, true, "adminToken");
        Assert.Single(result4);
    }

    [Fact]
    public void UpdateIsActiveStatus_Ok() 
    {
        // Run test, and check success
        var result = _contactService.UpdateIsActiveStatus(testRequestId, true, "adminToken");
        Assert.True(result);

        // Run test, and check success
        var request = _context.ContactRequests.Find(testRequestId);
        Assert.True(request!.IsActive);
    }

    [Fact]
    public void UpdateIsActiveNonRequest_Fails()
    {
        // Set up test data and run test
        Guid fakeId = Guid.NewGuid();
        var result = _contactService.UpdateIsActiveStatus(fakeId, true, "adminToken");

        // Check that service fails
        Assert.False(result, "Should not be able to update non-existing request");
    }

    [Fact]
    public void UpdateIsHandledStatus_Ok() 
    {
        var result = _contactService.UpdateIsHandledStatus(testRequestId, true, "adminToken");
        Assert.True(result);

        var request = _context.ContactRequests.Find(testRequestId);
        Assert.True(request!.IsHandled);
    }

    [Fact]
    public void UpdateHandledNonRequest_Fails()
    {
        // Set up test data and run test
        Guid fakeId = Guid.NewGuid();
        var result = _contactService.UpdateIsHandledStatus(fakeId, true, "adminToken");

        // Check that service fails
        Assert.False(result, "Should not be able to update non-existing request");
    }
    
    [Fact]
    public void RespondToMessage_Ok()
    {
        string message = "Test response";

        var result = _contactService.ResponseMessage(testRequestId, message);
        Assert.True(result);
    }

    [Fact]
    public void ValidateWrongRequest_Fails()
    {
        var nonEmail = new ContactRequestDto
        {
            UserEmail = "",
            UserMessage = "Test message",
            UserName = "Test User"
        };
        Assert.Throws<ArgumentException>(() => _contactService.CreateContactRequest(nonEmail));

        var nonMessage = new ContactRequestDto
        {
            UserEmail = "test@example.com",
            UserMessage = "",
            UserName = "Test User"
        };
        Assert.Throws<ArgumentException>(() => _contactService.CreateContactRequest(nonMessage));

        var nonName = new ContactRequestDto
        {
            UserEmail = "test@example.com",
            UserMessage = "Test message",
            UserName = ""
        };
        Assert.Throws<ArgumentException>(() => _contactService.CreateContactRequest(nonName));
    }

    [Fact]
    public void NonAdminUpdate_Fails()
    {
        var result = _contactService.UpdateIsActiveStatus(testRequestId, true, "testToken");
        Assert.False(result);

        var result2 = _contactService.UpdateIsHandledStatus(testRequestId, true, "testToken");
        Assert.False(result2);
    }

    [Fact]
    public void GetRequest_FailTests()
    {
        // Set up mock to return invalid token
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Run test with invalid token
        var tokenRes = _contactService.GetContactRequests(false, false, "fakeToken");
        Assert.Empty(tokenRes);

        var nonAdmin = _contactService.GetContactRequests(false, false, "testToken");
        Assert.Empty(nonAdmin);
    }
}