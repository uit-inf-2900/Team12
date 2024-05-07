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

public class UserInfoControllerTests
{
    // Initialize db, controller and services
    private readonly UserInfoController _controller;
    private readonly IUserInfoService _userInfoService;
    private readonly StrikkeappDbContext _context;

    // Set up mocks
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    private Guid testUserId = Guid.NewGuid();

    public UserInfoControllerTests()
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
        _userInfoService = new UserInfoService(_mockTokenService.Object, _mockPasswordHasher.Object, _context);
        _controller = new UserInfoController(_userInfoService);

        // Seed database
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add user to database
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

        _context.SaveChanges();
    }

    [Fact]
    public void GetProfileInfo_Ok()
    {
        // Mock token service
        _mockTokenService.Setup(s => s.ExtractUserID("testToken"))
            .Returns(TokenResult.ForSuccess(testUserId));

        // Run service and verify success
        var result = _controller.GetProfileInfo("testToken");
        var okRes = Assert.IsType<OkObjectResult>(result);

        // Verify response
        Assert.Contains("UserFullName = Test User", okRes.Value!.ToString());
        Assert.Contains("UserEmail = test@user.com", okRes.Value!.ToString());
    }

    [Fact]
    public void FakeTokenGetProfile_Fails()
    {
        // Mock token service
        _mockTokenService.Setup(s => s.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Run service and verify failure
        var result = _controller.GetProfileInfo("fakeToken");
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public void NonUserGet_Fails()
    {
        // Mock token service
        _mockTokenService.Setup(s => s.ExtractUserID("testToken"))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        // Run service and verify failure
        var result = _controller.GetProfileInfo("testToken");
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void UpdateProfileInfo_Ok()
    {
        // Mock token service
        _mockTokenService.Setup(s => s.ExtractUserID("testToken"))
            .Returns(TokenResult.ForSuccess(testUserId));

        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), "newPassword"))
            .Returns("newHashedPassword");

        // Run service and verify success
        var result = _controller.UpdateProfileInfo(new UserInfoController.UpdateRequest
        {
            Token = "testToken",
            UserFullName = "New Name",
            UserEmail = "new@email.com",
            OldPassword = "password",
            NewPassword = "newPassword"
        });
        var okRes = Assert.IsType<OkObjectResult>(result);
        var updateRes = Assert.IsType<List<string>>(okRes.Value);

        // Verify response
        Assert.Contains("UserFullName", updateRes);
        Assert.Contains("UserEmail", updateRes);
        Assert.Contains("UserPassword", updateRes);
    }
}