using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using MailerSend.AspNetCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Microsoft.Extensions.DependencyInjection;


using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;


namespace Strikkeapp.Tests.Services;

public class MailServiceTests
{
    // Set up services
    private readonly StrikkeappDbContext _context;
    private readonly MailService _mailService;

    // Mock services
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<IVerificationService> _mockVerificationService = new Mock<IVerificationService>();
    
    // Test data
    private Guid testUserGuid = Guid.NewGuid();
    private string testVerification = "123456";

    public MailServiceTests()
    {
        // Set up configuration
        var configurationBuilder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);

         var services = new ServiceCollection();

        // Add services to the container.
        services.AddDbContext<StrikkeappDbContext>(opts => opts.UseInMemoryDatabase(dbName));
        services.AddScoped<ITokenService>(_ => _mockTokenService.Object);
        services.AddScoped<IVerificationService>(_ => _mockVerificationService.Object);
        services.AddScoped<IPasswordHasher<object>>(_ => _mockPasswordHasher.Object);

        // Add mailersend
        services.Configure<MailerSendOptions>(configurationBuilder.GetSection("MailerSend"));
        services.AddMailerSend();

        // Add mail service
        var serviceProvider = services.BuildServiceProvider();
        _mailService = new MailService(_context, 
                                        serviceProvider.GetRequiredService<ITokenService>(), 
                                        serviceProvider.GetRequiredService<IVerificationService>(), 
                                        serviceProvider.GetRequiredService<MailerSendService>());

        // Seed test data
        SeedTestData();
    }

    private void SeedTestData()
    {
        var login = new UserLogIn
        {
            UserId = testUserGuid,
            UserEmail = "test@example.com",
            UserPwd = "hashedPassword",
            UserStatus = "verified",
        };
        _context.UserLogIn.Add(login);
        
        var verification = new UserVerification
        {
            UserId = testUserGuid,
            VerificationCode = testVerification
        };
        _context.UserVerification.Add(verification);

        _context.SaveChanges();
    }

    [Fact]
    public void SendVerification_Ok()
    {
        // Set up test data and mock
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        _mockVerificationService.Setup(s => s.CreateVerification(testToken))
            .Returns(VerificationResultCreate.ForSuccess(testVerification));

        var result = _mailService.SendVerification(testToken);

        Assert.True(result.Success, "Service should return success");
    }

    [Fact]
    public void FakeToken_Fails()
    {
        // Set up test data and mock
        var testToken = "fakeToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForFailure("Invalid token"));

        var result = _mailService.SendVerification(testToken);

        Assert.False(result.Success, "Service should return failure");
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void NonUser_Fails()
    {
        // Set up test data and mock
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        var result = _mailService.SendVerification(testToken);

        Assert.False(result.Success, "Service should return failure");
        Assert.Equal("Not found", result.ErrorMessage);
    }
}