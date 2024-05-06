
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
            _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

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
    public void BadRequest_Fails()
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

        Assert.IsType<ConflictObjectResult>(result);
    }
}