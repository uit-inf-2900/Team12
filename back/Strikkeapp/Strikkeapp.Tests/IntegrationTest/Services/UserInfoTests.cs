using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Moq;

using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Tests;

public class UserInfoTests
{
    private readonly StrikkeappDbContext _context;
    private readonly UserInfoService _userInfoService;

    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    private Guid testUserGuid;

    public UserInfoTests()
    {
        // Set up in memory database
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: "UserServiceDb")
            .ConfigureWarnings(war => war.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Set up context and service
        _context = new StrikkeappDbContext(options);

        // Ensure clean database for each test
        _context.Database.EnsureDeleted();
        _context.Database.EnsureCreated();

        _userInfoService = new UserInfoService(_mockTokenService.Object, _mockPasswordHasher.Object, _context);

        // Add test data to database
        SeedTestData();
    }

    private void SeedTestData()
    {
        // Set up test data
        var testUserLogin = new UserLogIn
        {
            UserId = Guid.NewGuid(),
            UserEmail = "test@example.com",
            UserPwd = "Test1234!"
        };

        testUserGuid = testUserLogin.UserId;

        var testUserDetails = new UserDetails
        {
            UserId = testUserLogin.UserId,
            UserFullName = "Test Testing",
            DateOfBirth = DateTime.UtcNow
        };

        // Add to in memory db
        _context.UserLogIn.Add(testUserLogin);
        _context.UserDetails.Add(testUserDetails);
        _context.SaveChanges();
    }

    [Fact]
    public void GetProfileInfo_Ok()
    {
        // Test data
        var testJwtToken = "testToken";
        var expectedEmail = "test@example.com";
        var expetedFullName = "Test Testing";

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify result
        var res = _userInfoService.GetProfileInfo(testJwtToken);

        Assert.True(res.Success);
        Assert.Equal(expectedEmail, res.UserEmail);
        Assert.Equal(expetedFullName, res.UserFullName);
    }

    [Fact]
    public void FakeTokenGet_Fails()
    {
        // Test data
        var testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForFailure("Invalid token"));

        var res = _userInfoService.GetProfileInfo(testToken);

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void NonUserGet_Fails()
    {
        // Test data
        var testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        var result = _userInfoService.GetProfileInfo(testToken);

        Assert.False(result.Success);
        Assert.Equal("User not found", result.ErrorMessage);
    }

    [Fact]
    public void UpdateEmailName_ValidDataSuccess()
    {
        // Test data
        var testJwtToken = "testToken";
        var newEmail = "Newtest@example.com";
        var newFullName = "New Testing";

        // Mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and erify results
        var res = _userInfoService.UpdateProfileInfo(testJwtToken, newFullName, newEmail, null, null);

        Assert.True(res.Success);
        Assert.Contains("UserEmail", res.UpdatedFields!);
        Assert.Contains("UserFullName", res.UpdatedFields!);

        // Verify changes in db
        var updatedUserDetails = _context.UserDetails.
            FirstOrDefault(ud => ud.UserId == testUserGuid);
        var updatedUserLogin = _context.UserLogIn.
            FirstOrDefault(ul => ul.UserId == testUserGuid);

        Assert.Equal(newFullName, updatedUserDetails?.UserFullName);
        Assert.Equal(newEmail, updatedUserLogin?.UserEmail);
    }

    [Fact]
    public void UpdatePassword_ValidDataSuccess()
    {
        // Test data
        var testJwtToken = "testToken";
        var oldPassword = "Test1234!";
        var newPassword = "NewPassword123!";
        var hashedNewPassword = "hashedNewPassword";

        // Mock services
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        _mockPasswordHasher.Setup(h => h.HashPassword(It.IsAny<object>(), newPassword))
            .Returns(hashedNewPassword);

        _mockPasswordHasher.Setup(h => h.VerifyHashedPassword(It.IsAny<object>(), It.IsAny<string>(), oldPassword))
            .Returns(PasswordVerificationResult.Success);

        // Run service and verify results
        var res = _userInfoService.UpdateProfileInfo(testJwtToken, null, null, oldPassword, newPassword);

        Assert.True(res.Success);
        Assert.Contains("UserPassword", res.UpdatedFields!);

        // Verify changes in db
        var updatedUserLogin = _context.UserLogIn.
            FirstOrDefault(ul => ul.UserId == testUserGuid);
        Assert.Equal(hashedNewPassword, updatedUserLogin?.UserPwd);
    }

    [Fact]
    public void FakeTokenUpdate_Fails()
    {
        // Test data
        var testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run service and verify results
        var res = _userInfoService.UpdateProfileInfo(testToken, "New Name", null, null, null);

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void EmptyUpdate_Fails()
    {
        // Set up test data and mock
        var testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify results
        var res = _userInfoService.UpdateProfileInfo(testToken, null, null, null, null);

        Assert.False(res.Success);
        Assert.Equal("No fields to update", res.ErrorMessage);
    }

    [Fact]
    public void NonUserUpdate_Fails()
    {
        // Set up test data and mock
        var fakeToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        // Run service and verify results
        var result = _userInfoService.UpdateProfileInfo(fakeToken, "New Name", null, null, null);

        Assert.False(result.Success);
        Assert.Equal("User not found", result.ErrorMessage);
    }

    [Fact]
    public void InvalidOrMissingPassword_Fails()
    {
        // Test data
        var testToken = "testToken";
        var newPassword = "NewPassword123!";

        // Mock services
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run service and verify results
        var newmissing = _userInfoService.UpdateProfileInfo(testToken, null, null, "Test1234!", null);

        Assert.False(newmissing.Success, "New password missing, should fail");
        Assert.Equal("Password missing", newmissing.ErrorMessage);

        var wrongPwd = _userInfoService.UpdateProfileInfo(testToken, null, null, "WrongPassword", newPassword);
        Assert.False(wrongPwd.Success, "New password missing, should fail");
        Assert.Equal("Wrong password", wrongPwd.ErrorMessage);
    }

}