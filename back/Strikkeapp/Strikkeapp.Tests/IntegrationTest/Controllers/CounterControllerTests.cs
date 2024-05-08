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
    private Guid testCounterId = Guid.NewGuid();

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
            CounterId = testCounterId,
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

    [Fact]
    public void UpdateCounter_Ok()
    {
        // Call controller with valid request and verify response
        var request = new UpdateCounterRequest
        {
            userToken = "userToken",
            counterId = testCounterId,
            newName = "updated counter"
        };

        var response = _controller.UpdateCounter(request);
        Assert.IsType<OkResult>(response);
    }

    [Fact]
    public void BadRequestUpdate_Fails()
    {
        // Empty request
        var request = new UpdateCounterRequest
        {
            userToken = "",
            counterId = Guid.Empty,
            newName = ""
        };

        // Call controller with empty request and verify response
        var response = _controller.UpdateCounter(request);
        Assert.IsType<BadRequestResult>(response);
    }

    [Fact]
    public void FakeTokenUpdate_Fails()
    {
        // Mock service to return unauthorized
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Call controller with fake token and verify response
        var request = new UpdateCounterRequest
        {
            userToken = "fakeToken",
            counterId = testCounterId,
            newName = "updated counter"
        };

        var response = _controller.UpdateCounter(request);
        Assert.IsType<UnauthorizedResult>(response);
    }

    [Fact]
    public void NonCounterUpdate_Fails()
    {
        // Call controller with non counter id
        var request = new UpdateCounterRequest
        {
            userToken = "userToken",
            counterId = Guid.NewGuid(),
            newName = "updated counter"
        };

        var response = _controller.UpdateCounter(request);
        Assert.IsType<NotFoundObjectResult>(response);
    }

    [Fact]
    public void IncDecCounter_Ok()
    {
        // Call controller and verify response
        var incResult = _controller.IncrementCounter("userToken", testCounterId);
        Assert.IsType<OkResult>(incResult);

        // Verify that the counter was incremented
        var counter = _context.CounterInventory.Find(testCounterId);
        Assert.Equal(6, counter!.RoundNumber);

        var decResult = _controller.DecrementCounter("userToken", testCounterId);
        Assert.IsType<OkResult>(decResult);

        // Verify that the counter was decremented
        counter = _context.CounterInventory.Find(testCounterId);
        Assert.Equal(5, counter!.RoundNumber);
    }

    [Fact]
    public void InDecFakeToken_Fails()
    {
        // Mock service to return unauthorized
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Call controller with fake token and verify response
        var incResult = _controller.IncrementCounter("fakeToken", testCounterId);
        Assert.IsType<UnauthorizedResult>(incResult);

        var decResult = _controller.DecrementCounter("fakeToken", testCounterId);
        Assert.IsType<UnauthorizedResult>(decResult);
    }

    [Fact]
    public void NonCounterIncDec_Fails()
    {
        // Call controller with non counter id
        var incResult = _controller.IncrementCounter("userToken", Guid.NewGuid());
        Assert.IsType<NotFoundObjectResult>(incResult);

        var decResult = _controller.DecrementCounter("userToken", Guid.NewGuid());
        Assert.IsType<NotFoundObjectResult>(decResult);
    }

    [Fact]
    public void DeleteCounter_Ok()
    {
        // Call controller with valid request and verify response
        var request = new DeleteCounterRequest
        {
            userToken = "userToken",
            counterId = testCounterId
        };

        var response = _controller.DeleteCounter(request);
        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void BadRequestDelete_Fails()
    {
        // Empty request
        var request = new DeleteCounterRequest
        {
            userToken = "",
            counterId = Guid.Empty
        };

        // Call controller with empty request and verify response
        var response = _controller.DeleteCounter(request);
        Assert.IsType<BadRequestResult>(response);
    }

    [Fact]
    public void FakeTokenDelete_Fails()
    {
        // Mock service to return unauthorized
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Call controller with fake token and verify response
        var request = new DeleteCounterRequest
        {
            userToken = "fakeToken",
            counterId = testCounterId
        };

        var response = _controller.DeleteCounter(request);
        Assert.IsType<UnauthorizedResult>(response);
    }

    [Fact]
    public void NonCounterDelete_Fails()
    {
        // Call controller with non counter id
        var request = new DeleteCounterRequest
        {
            userToken = "userToken",
            counterId = Guid.NewGuid()
        };

        var response = _controller.DeleteCounter(request);
        var nfRes = Assert.IsType<NotFoundObjectResult>(response);

        // Verify that the correct error message was returned
        Assert.Equal("Could not find counter", nfRes.Value);
    }
}