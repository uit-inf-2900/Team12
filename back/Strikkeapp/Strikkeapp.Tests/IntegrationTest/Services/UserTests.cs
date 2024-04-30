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

        var testEntry = new UserLogIn
        {
            UserEmail = "banned@user.com",
            UserPwd = "HashedPassword",
            UserStatus = "Banned"
        };

        _context.UserDetails.Add(testUserDetails);

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
        var bannedEmail = "banned @user.com";
        var bannedPwd = "Test123!";

        var result = _userService.LogInUser(bannedEmail, bannedPwd);

        // Banned user should not log in
        Assert.False(result.Success);
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
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserId));

        var res = _userService.DeleteUser(testToken);

        Assert.True(res.Success);
    }
}
