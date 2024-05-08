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

public class CounterControllerTests
{
    // Set up db, controller and service
    private readonly CounterController _controller;
    private readonly CounterService _counterService;
    private readonly StrikkeappDbContext _context;

    // Set up mocks
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    // Test variables
    private Guid testUserId = Guid.NewGuid();
    private Guid counterId = Guid.NewGuid();

    public CounterControllerTests()
    {
        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
            .Returns("hashedPassword");
        _mockTokenService.Setup(x => x.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(testUserId));
        
        // Set up in memory database
        string databaseName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName)
            .ConfigureWarnings(war => war.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Create context and service
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _counterService = new CounterService(_context, _mockTokenService.Object);
        _controller = new CounterController(_counterService);

        // Set up db with test data
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add user to db
        _context.UserLogIn.Add(new UserLogIn
        {
            UserId = testUserId,
            UserEmail = "test@user.com",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        });

        // Add counter to db
        _context.CounterInventory.Add(new Counter
        {
            CounterId = counterId,
            UserId = testUserId,
            RoundNumber = 5,
            Name = "test counter"
        });
            
        _context.SaveChanges();
    }

    [Fact]
    public void CreateCounter_Ok()
    {
        // Call controller with valid request and verify response
        var request = new CreateCounterRequest
        {
            userToken = "userToken",
            name = "new counter"
        };

        var response = _controller.CreateCounter(request);
        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void BadRequestCreate_Fails()
    {
        // Empty request
        var request = new CreateCounterRequest
        {
            userToken = "",
            name = ""
        };

        // Call controller with empty request and verify response
        var response = _controller.CreateCounter(request);
        Assert.IsType<BadRequestResult>(response);
    }

    [Fact]
    public void FakeTokenCreate_Fails()
    {
        // Mock service to return unauthorized
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Call controller with fake token and verify response
        var request = new CreateCounterRequest
        {
            userToken = "fakeToken",
            name = "new counter"
        };

        var response = _controller.CreateCounter(request);
        Assert.IsType<UnauthorizedResult>(response);
    }

    [Fact]
    public void GetCountersOk()
    {
        // Call controller and verify response
        var response = _controller.GetCounter("userToken");
        var okRes = Assert.IsType<OkObjectResult>(response);

        // Verify that the correct counter was returned
        var counters = Assert.IsType<List<Counter>>(okRes.Value);
        Assert.Single(counters);
    }

    [Fact]
    public void FakeTokenGet_Fails()
    {
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        var response = _controller.GetCounter("fakeToken");
        Assert.IsType<UnauthorizedResult>(response);
    }
}