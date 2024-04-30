using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Services;
using Strikkeapp.Models;

namespace Strikkeapp.Tests;

public class UserServiceTests
{
    // Set up db context and service to test
    private readonly StrikkeappDbContext _context;
    private readonly UserService _userService;
    // Create mock services
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    private Guid testUserId = Guid.NewGuid();
    private Guid adminGuid = Guid.NewGuid();

    public UserServiceTests()
    {
        // Set up in memory database
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: "StrikkeappTestDb")
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Create new context with the options
        _context = new StrikkeappDbContext(options);

        // Set up userservice to test
        _userService = new UserService(_context, _mockTokenService.Object, _mockPasswordHasher.Object);

        SeedTestData();
    }

    private void SeedTestData()
    {
        var testUserLogIn = new UserLogIn
        {
            UserId = testUserId,
            UserEmail = "test@example.com",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        };

        _context.UserLogIn.Add(testUserLogIn);

        var testUserDetails = new UserDetails
        {
            UserId = testUserId,
            UserFullName = "Test Testing",
            DateOfBirth = new DateTime(2024, 1, 1),
            IsAdmin = false
        };
        _context.UserDetails.Add(testUserDetails);

        var testEntry = new UserLogIn
        {
            UserEmail = "banned@user.com",
            UserPwd = "HashedPassword",
            UserStatus = "banned"
        };
        _context.UserLogIn.Add(testEntry);

        var bannedDetails = new UserDetails
        {
            UserId = testEntry.UserId,
            UserFullName = "Banned User",
            DateOfBirth = DateTime.Now,
            IsAdmin = false
        };
        _context.UserDetails.Add(bannedDetails);

        var adminEntry = new UserLogIn
        {
            UserId = adminGuid,
            UserEmail = "admin@admin",
            UserPwd = "HashedPwd",
            UserStatus = "verified"
            
        };
        _context.UserLogIn.Add(adminEntry);

        var adminDetails = new UserDetails
        {
            UserId = adminEntry.UserId,
            UserFullName = "Admin Admin",
            DateOfBirth = DateTime.Now,
            IsAdmin = true
        };
        _context.UserDetails.Add(adminDetails);

        _context.SaveChanges();
    }

    [Fact]
    public void CreateUserTest()
    {
        // Set test variables
        var testEmail = "newtest@example.com";
        var testPassword = "Test123!";
        var testFullName = "Test Testing";
        var testDob = new DateTime(2024, 1, 1);

        // Mock behaviour
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");
        _mockTokenService.Setup(x => x.GenerateJwtToken(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<string>()))
                         .Returns("fakeToken");

        // Run CreateUser with test variables
        var result = _userService.CreateUser(testEmail, testPassword, testFullName, testDob);

        // Check expected results
        Assert.True(result.Success);
        _mockPasswordHasher.Verify(x => x.HashPassword(testEmail, testPassword), Times.Once);
        _mockTokenService.Verify(x => x.GenerateJwtToken(testEmail, It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<string>()), Times.Once);

        // Cleanup database
        _context.Database.EnsureDeleted();
    }

    [Fact]
    public void CreateDuplicate_Fails()
    {
        var testEmail = "test@example.com";
        var testPassword = "Test123!";
        var testFullName = "Test Testing";
        var testDob = new DateTime(2024, 1, 1);

        var result = _userService.CreateUser(testEmail, testPassword, testFullName, testDob);

        Assert.False(result.Success);

    }

    [Fact]
    public void LogInUserTest()
    {
        // Set up test variables
        var testEmail = "test@example.com";
        var testPassword = "Test123!";
        var hashedPassword = "hashedPassword";


        // Mock behaviour
        _mockPasswordHasher.Setup(x => x.VerifyHashedPassword(It.IsAny<object>(), hashedPassword, testPassword))
            .Returns(PasswordVerificationResult.Success);

        _mockTokenService.Setup(x => x.GenerateJwtToken(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<string>()))
                 .Returns("fakeToken");

        // Run LogInUser with test variables
        var result = _userService.LogInUser(testEmail, testPassword);

        // Check expected results
        Assert.True(result.Success);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<object>(), hashedPassword, testPassword), Times.Once);
        _mockTokenService.Verify(x => x.GenerateJwtToken(testEmail, It.IsAny<Guid>(), It.IsAny<bool>(), It.IsAny<string>()), Times.Once);

        // Cleanup database
        _context.Database.EnsureDeleted();
    }

    [Fact]
    public void LogInNonUser_Fails()
    {
        // Test data
        var testEmail = "non@user.com";
        var testPwd = "Test123!";

        // Run test
        var result = _userService.LogInUser(testEmail, testPwd);

        // Non use log in should fail
        Assert.False(result.Success);
    }

    [Fact]
    public void BannedLogIn_Fails()
    {
        // Test data
        var bannedEmail = "banned@user.com";
        var bannedPwd = "Test123!";
        var hashedPwd = "HashedPassword";

        _mockPasswordHasher.Setup(x => x.VerifyHashedPassword(It.IsAny<object>(), hashedPwd, bannedPwd))
            .Returns(PasswordVerificationResult.Success);

        var result = _userService.LogInUser(bannedEmail, bannedPwd);

        // Banned user should not log in
        Assert.False(result.Success);
        Assert.Equal("User is banned", result.ErrorMessage);
    }

    [Fact]
    public void WrongPassword_Fails() 
    {
        // Set up test variables
        var testEmail = "test@example.com";
        var testPassword = "WrongPwd";
        var hashedPassword = "WrongHash";

        // Mock behaviour
        _mockPasswordHasher.Setup(x => x.VerifyHashedPassword(It.IsAny<object>(), hashedPassword, testPassword))
            .Returns(PasswordVerificationResult.Success);

        var result = _userService.LogInUser(testEmail, testPassword);

        Assert.False(result.Success);
    }

    [Fact]
    public void DeleteUser_Ok()
    {
        // Set up data and mock
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserId));

        // Run serivce, and check for success
        var res = _userService.DeleteUser(testToken);

        Assert.True(res.Success);
    }

    [Fact]
    public void UnauthorizedDeletion_Fails()
    {
        // Set up data and mock
        var testToken = "unathorizedToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Run service
        var result = _userService.DeleteUser(testToken);

        // Should fail, with correct error message
        Assert.False(result.Success, "Unvalid token should fail");
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void UserNullDeletion_Fails()
    {
        var testToken = "testToken";
        var nonExistentUserId = Guid.NewGuid();

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(nonExistentUserId));

        var result = _userService.DeleteUser(testToken);

        Assert.False(result.Success);

    }

    [Fact]
    public void UpdateAdmin_Ok()
    {
        // Set up test data and mock
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(adminGuid));

        // Setting admin should work
        var result_set = _userService.UpdateAdmin(testToken, testUserId, true);
        Assert.True(result_set.Success);

        //Removing admin should work
        var result_remove = _userService.UpdateAdmin(testToken, testUserId, false);
        Assert.True(result_remove.Success);
    }

    [Fact]
    public void NonAdminUpdate_Fails()
    {
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserId));

        var result = _userService.UpdateAdmin(testToken, testUserId, true);

        Assert.False(result.Success);
    }

    [Fact]
    public void NonUserUpdate_Fails()
    {
        // Set up test data and mock
        var testToken = "testToken";
        Guid fakeGuid = Guid.NewGuid();

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(adminGuid));

        // Run service
        var result = _userService.UpdateAdmin(testToken, fakeGuid, true);

        // Should fail, with correct error message
        Assert.False(result.Success);
        Assert.Equal("User not found", result.ErrorMessage);
    }

    [Fact]
    public void BanUser_Ok()
    {
        // Set up test data and mock
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(adminGuid));

        // Ban user should work
        var ban = _userService.BanUser(testToken, testUserId, true);
        Assert.True(ban.Success);

        // Unban user should work
        var unban = _userService.BanUser(testToken, testUserId, false);
        Assert.True(unban.Success);
    }

    [Fact]
    public void NonAdminBan_Fails()
    {
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserId));

        var result = _userService.BanUser(testToken, testUserId, true);

        Assert.False(result.Success);
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void NonUserBan_Fails()
    {
        // Set up test data and mock
        var testToken = "testToken";
        Guid fakeGuid = Guid.NewGuid();

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(adminGuid));

        // Run service
        var result = _userService.BanUser(testToken, fakeGuid, true);

        // Should fail, with correct error message
        Assert.False(result.Success);
        Assert.Equal("User not found", result.ErrorMessage);
    }
}
