using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Tests;

public class VerificationTests : IDisposable
{
    // Define service
    private readonly StrikkeappDbContext _context;
    private readonly VerificationService _verificationService;

    // Set up mock services
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    private readonly Guid testGuid = Guid.NewGuid();
    private readonly Guid testUserGuid = Guid.NewGuid();
    private string verificationString = "123456";

    public VerificationTests()
    {
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new StrikkeappDbContext(options);
         
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
        _context.SaveChanges();

        Assert.True(verificationEntry.VerificationCode == verificationString);
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
    public void VerifyCode_Ok()
    {
        // Set up test
        string testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
                    .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _verificationService.VerifyCode(testToken, verificationString);

        Assert.True(res.Success, res.ErrorMessage);
    }
}
