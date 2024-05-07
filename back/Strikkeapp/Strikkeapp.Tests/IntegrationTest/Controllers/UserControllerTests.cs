
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

using Strikkeapp.Controllers;
using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;
using Strikkeapp.User.Models;
using Strikkeapp.Data.Entities;


namespace Strikkeapp.Tests.Controllers;

public class UsersControllerTests
{
    private readonly UsersController _controller;
    private readonly IUserService _userService;
    private readonly StrikkeappDbContext _context;

    // Set up mock services
    private readonly Mock<IMailService> _mockMailService = new Mock<IMailService>();
    private readonly Mock<IVerificationService> _mockVerificationService = new Mock<IVerificationService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    private Guid testUserId = Guid.NewGuid();
    private Guid testAdminId = Guid.NewGuid();
    public UsersControllerTests()
    {
        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
            .Returns("hashedPassword");
        _mockPasswordHasher.Setup(p => p.VerifyHashedPassword(It.IsAny<object>(), It.IsAny<string>(), It.IsAny<string>()))
            .Returns(PasswordVerificationResult.Success);

        _mockTokenService.Setup(x => x.GenerateJwtToken(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<string>()))
            .Returns("token");
        

        // Set up in memory database
        string databaseName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName)
            .ConfigureWarnings(war => war.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Set up context and service
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _userService = new UserService(_context, _mockTokenService.Object, _mockPasswordHasher.Object);
        _controller = new UsersController(_userService, _context, _mockMailService.Object, _mockVerificationService.Object);

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

        _context.UserLogIn.Add(new UserLogIn
        {
            UserEmail = "banned@user.com",
            UserPwd = "hashedPassword",
            UserStatus = "banned"
        });

        _context.SaveChanges();
    }

    [Fact]
    public void CreateUser_Ok()
    {
        // Create request and call controller
        var request = new CreateUserRequest
        {
            UserEmail = "test@example.com",
            UserPwd = "Test123!",
            UserFullName = "Test User",
            UserDOB = 20240101
        };
        var result = _controller.CreateUser(request);

        Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(result);
    }

    [Fact]
    public void CreateDuplicate_Falils()
    {
        var request = new CreateUserRequest
        {
            UserEmail = "test@user.com",
            UserPwd = "somePassword",
            UserFullName = "Test User",
            UserDOB = 20240101
        };
        var result = _controller.CreateUser(request);
        
        // Extract response and check it is correct
        var conflicResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.NotNull(conflicResult);
        Assert.Contains("Email already exsits", conflicResult.Value!.ToString());
    }

    [Fact]
    public void CreateInvalidRequest_Fails()
    {
        var request = new CreateUserRequest
        {
            UserEmail = "",
            UserPwd = "",
            UserFullName = "",
            UserDOB = 0
        };
        var result = _controller.CreateUser(request);

        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public void LoginUser_Ok()
    {
        var request = new LogInUserRequest
        {
            UserEmail = "admin@knithub.no",
            UserPwd = "somePassword"
        };

        var result = _controller.LogInUser(request);
        Assert.IsType<OkObjectResult>(result);
    }

        [Fact]
    public void BadRequestLogin_Fails()
    {
        var request = new CreateUserRequest
        {
            UserEmail = "",
            UserPwd = "",
            UserFullName = "",
            UserDOB = 0
        };
        var result = _controller.CreateUser(request);

        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public void BannedUserLogin_Fails()
    {
        // Set up request for banned user
        var request = new LogInUserRequest
        {
            UserEmail = "banned@user.com",
            UserPwd = "somePassword"
        };

        // Call controller and check response
        var result = _controller.LogInUser(request);
        var bannedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Contains("User is banned", bannedResult.Value!.ToString());
    }

    [Fact]
    public void WrongPasswordLogin_Fails()
    {
        _mockPasswordHasher.Setup(p => p.VerifyHashedPassword(It.IsAny<object>(), It.IsAny<string>(), "somePassword"))
            .Returns(PasswordVerificationResult.Failed);

        var result = _controller.LogInUser(new LogInUserRequest
        {
            UserEmail = "test@user.com",
            UserPwd = "somePassword"
        });

        var failedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Contains("Invalid login attempt", failedResult.Value!.ToString());
    }

    [Fact]
    public void DeleteUser_Ok()
    {
        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserId));

        // Run controller, and verify success
        var result = _controller.DeleteUser("token");
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public void DeleteInvalidToken_Fails()
    {
        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run controller, and verify failure
        var result = _controller.DeleteUser("fakeToken");
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public void DeleteUserNotFound_Fails()
    {
        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        // Run controller, and verify failure
        var result = _controller.DeleteUser("token");
        var foundResult = Assert.IsType<ObjectResult>(result);
        Assert.Contains("Unable to find user", foundResult.Value!.ToString());
    }

    [Fact]
    public void UpdateAdmin_Ok()
    {
        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID("adminToken"))
            .Returns(TokenResult.ForSuccess(testAdminId));

        // Add admin, and verify success
        var addAdmin = _controller.UpdateAdmin(new UpdateAdminRequest
        {
            UserToken = "adminToken",
            UpdateUser = testUserId,
            NewAdmin = true
        });
        Assert.IsType<OkObjectResult>(addAdmin);

        // Check that user is now admin
        var adminUser = _context.UserDetails.Find(testUserId);
        Assert.True(adminUser!.IsAdmin);

        // Remove admin, and verify success
        var removeAdmin = _controller.UpdateAdmin(new UpdateAdminRequest
        {
            UserToken = "adminToken",
            UpdateUser = testUserId,
            NewAdmin = false
        });
        Assert.IsType<OkObjectResult>(removeAdmin);

        // Check that user is no longer admin
        adminUser = _context.UserDetails.Find(testUserId);
        Assert.False(adminUser!.IsAdmin);
    }
}