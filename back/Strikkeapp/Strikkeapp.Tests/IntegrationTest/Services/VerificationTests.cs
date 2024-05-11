using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Tests.Services;

public class VerificationTests : IDisposable
{
    // Define service
    private readonly StrikkeappDbContext _context;
    private readonly VerificationService _verificationService;

    // Set up mock services
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    private readonly Guid testGuid = Guid.NewGuid();
    private readonly Guid testUserGuid = Guid.NewGuid();
    private string verificationString = "123456";

    public VerificationTests()
    {
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
         
        _verificationService = new VerificationService(_context, _mockTokenService.Object);

        SeedTestData();
    }

    private void SeedTestData()
    {
        // Add test entry
        var verificationEntry = new UserVerification
        {
            UserId = testUserGuid,
            VerificationCode = verificationString
        };
        _context.UserVerification.Add(verificationEntry);

        var loginEntry = new UserLogIn
        {
            UserId = testUserGuid,
            UserEmail = "test@example.com",
            UserPwd = "HashedPwd"
        };
        _context.UserLogIn.Add(loginEntry);

        _context.UserDetails.Add(new UserDetails
        {
            UserId = testUserGuid,
            UserFullName = "Test User",
        });


        _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public void CreateVerification_Ok()
    {
        // Set up test
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForSuccess(testGuid));

        // Run serice and assert if it fails
        var res = _verificationService.CreateVerification(testToken);

        Assert.True(res.Success);

        // Entry should exist in db
        var entry = _context.UserVerification
            .Any(uid => uid.UserId == testGuid);
        Assert.True(entry);
    }

    [Fact]
    public void FakeTokenCreateVerification_Fail()
    {
        // Set up test
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForFailure("Invalid token"));

        // Run serice and assert if it fails
        var res = _verificationService.CreateVerification(testToken);

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void VerifyCode_Ok()
    {
        // Set up test and mock
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _verificationService.VerifyCode(testToken, verificationString);

        // Should pass
        Assert.True(res.Success, res.ErrorMessage);

        // Entry should be updated
        var entry = _context.UserLogIn
            .FirstOrDefault(u => u.UserId == testUserGuid);

        Assert.NotNull(entry);
        Assert.Equal("verified", entry.UserStatus!);
    }

    [Fact]
    public void FakeTokenVerify_Fails()
    {
        // Set up test and mock
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForFailure("Invalid token"));

        var res = _verificationService.VerifyCode(testToken, verificationString);
        
        // Should fail with "Unauthorized"
        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void InvalidCodeVerify_Fails()
    {
        // Set up test and mock
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _verificationService.VerifyCode(testToken, "invalidCode");
        
        // Should fail with correct message
        Assert.False(res.Success);
        Assert.Equal("Not found", res.ErrorMessage);
    }

    [Fact]
    public void NonUserCodeVerify_Fails()
    {
        // Set up test and mock
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        var res = _verificationService.VerifyCode(testToken, verificationString);
        
        // Should fail with correct message
        Assert.False(res.Success);
        Assert.Equal("Not found", res.ErrorMessage);
    }

    [Fact]
    public void InvalidUserId_Fails()
    {
        // Set up test and mock
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
                    .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        var res = _verificationService.VerifyCode(testToken, verificationString);

        // Should fail with correct message
        Assert.False(res.Success);
        Assert.Equal("Not found", res.ErrorMessage);
    }
}
