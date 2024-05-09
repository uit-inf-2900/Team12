using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

using Strikkeapp.Controllers;
using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;
using Strikkeapp.Data.Entities;

namespace Strikkeapp.Tests.Controllers;

public class InventoryControllerTests
{
    // Set up db, controller and service
    private readonly InventoryController _controller;
    private readonly InventoryService _inventoryService;
    private readonly StrikkeappDbContext _context;

    // Set up mocks
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    // Test variables
    private Guid testUserId = Guid.NewGuid();
    private Guid testNeedleId = Guid.NewGuid();
    private Guid testYarnId = Guid.NewGuid();


    public InventoryControllerTests()
    {
        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
            .Returns("hashedPassword");
        _mockTokenService.Setup(e => e.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(testUserId));
        _mockTokenService.Setup(e => e.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Set up in memory database
        string databaseName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName)
            .ConfigureWarnings(war => war.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Initialize controller and service
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _inventoryService = new InventoryService(_context, _mockTokenService.Object);
        _controller = new InventoryController(_inventoryService);

        // Seed database
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add regular user to database
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

        _context.NeedleInventory.Add(new NeedleInventory
        {
            ItemID = testNeedleId,
            UserId = testUserId,
            Type = "Round",
            Size = 10,
            Length = 10,
            NumItem = 5,
            NumInUse = 1
        });

        _context.YarnInventory.Add(new YarnInventory
        {
            ItemID = testYarnId,
            UserId = testUserId,
            Type = "Wool",
            Manufacturer = "Test Manufacturer",
            Color = "Black",
            Batch_Number = "0x0",
            Weight = 10,
            Length = 10,
            Gauge = "20/20",
            NumItems = 5,
            InUse = 1,
            Notes = "Test Note"
        });

        _context.SaveChanges();
    }

    [Fact]
    public void GetInventory_Ok()
    {
        // Run controller and verify response
        var result = _controller.GetInventory("userToken");
        var okRes = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okRes.Value);

        // Verify that the inventory contains the expected number of items
        JObject inventory = JObject.FromObject(okRes.Value);
        // Retrieve the number of needles and yarns. Default to 0 if the inventory is null
        int needleCount = (inventory["needleInventory"] as JArray)?.Count ?? 0;
        int yarnCount = (inventory["yarnInventory"] as JArray)?.Count ?? 0;
        Assert.Equal(2, needleCount + yarnCount);
    }

    [Fact]
    public void FakeTokenGet_Fails()
    {
        // Run controller and verify response
        var result = _controller.GetInventory("fakeToken");
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public void AddNeedle_Ok()
    {
        // Set up request
        var request = new AddNeedleRequest
        {
            UserToken = "userToken",
            Type = "Pointy",
            Size = 10,
            Length = 10
        };

        // Run controller and verify response
        var result = _controller.AddNeedle(request);
        var okRes = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okRes.Value);

        // Verify that the needle was added
        var needle = _context.NeedleInventory
            .FirstOrDefault(e => e.UserId == testUserId && e.Type == "Pointy");

        Assert.NotNull(needle);
    }

    [Fact]
    public void BadNeedleAdd_Fails()
    {
        // Set up request
        var request = new AddNeedleRequest
        {
            UserToken = ""
        };

        // Run controller and verify response
        var result = _controller.AddNeedle(request);
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public void FakeTokenAddNeedle_Fails()
    {
        // Set up request
        var request = new AddNeedleRequest
        {
            UserToken = "fakeToken",
            Type = "Pointy",
            Size = 10,
            Length = 10
        };

        // Run controller and verify response
        var result = _controller.AddNeedle(request);
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public void UpdateNeedle_Ok()
    {
        // Set up request
        var request = new UpdateItemRequest 
        {
            UserToken = "userToken",
            ItemId = testNeedleId,
            NewNum = 10
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedle(request);
        var okRes = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okRes.Value);

        Assert.Contains(testNeedleId.ToString(), okRes.Value.ToString());
        Assert.Contains("10", okRes.Value.ToString());
    }

    [Fact]
    public void BadNeedleUpdate_Fails()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "",
            ItemId = testNeedleId,
            NewNum = 10
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedle(request);
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public void FakeTokenUpdateNeedle_Fails()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "fakeToken",
            ItemId = testNeedleId,
            NewNum = 10
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedle(request);
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public void NonNeedleUpdate_Fails()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "userToken",
            ItemId = Guid.NewGuid(),
            NewNum = 10
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedle(request);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void UpdateNeedlesUsed_Ok()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "userToken",
            ItemId = testNeedleId,
            NewNum = 4
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedlesUsed(request);
        var okRes = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okRes.Value);

        Assert.Contains(testNeedleId.ToString(), okRes.Value.ToString());
        Assert.Contains("4", okRes.Value.ToString());
    }

    [Fact]
    public void BadNeedleUsedUpdate_Fails()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "",
            ItemId = testNeedleId,
            NewNum = 4
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedlesUsed(request);
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public void ExceedNeedlesUsedUpdate_Fails()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "userToken",
            ItemId = testNeedleId,
            NewNum = 100
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedlesUsed(request);
        var response = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Not enough needles in inventory", response.Value!.ToString());
    }

    [Fact]
    public void FakeTokenUpdateNeedleUsed_Fails()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "fakeToken",
            ItemId = testNeedleId,
            NewNum = 4
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedlesUsed(request);
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public void NonNeedleUsedUpdate_Fails()
    {
        // Set up request
        var request = new UpdateItemRequest
        {
            UserToken = "userToken",
            ItemId = Guid.NewGuid(),
            NewNum = 4
        };

        // Run controller and verify response
        var result = _controller.UpdateNeedlesUsed(request);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void DeleteNeedle_Ok()
    {
        // Set up request
        var request = new DeleteItemRequest
        {
            UserToken = "userToken",
            ItemId = testNeedleId
        };

        // Run controller and verify response
        var result = _controller.DeleteNeedle(request);
        var okRes = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(testNeedleId.ToString(), okRes.Value!.ToString());
    }

    [Fact]
    public void BadNeedleDelete_Fails()
    {
        // Set up request
        var request = new DeleteItemRequest
        {
            UserToken = "",
            ItemId = testNeedleId
        };

        // Run controller and verify response
        var result = _controller.DeleteNeedle(request);
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public void FakeTokenDeleteNeedle_Fails()
    {
        // Set up request
        var request = new DeleteItemRequest
        {
            UserToken = "fakeToken",
            ItemId = testNeedleId
        };

        // Run controller and verify response
        var result = _controller.DeleteNeedle(request);
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public void NonNeedleDelete_Fails()
    {
        // Set up request
        var request = new DeleteItemRequest
        {
            UserToken = "userToken",
            ItemId = Guid.NewGuid()
        };

        // Run controller and verify response
        var result = _controller.DeleteNeedle(request);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void AddYarn_Ok()
    {
        // Set up request
        var request = new AddYarnRequest
        {
            UserToken = "userToken",
            Type = "Linen",
            Manufacturer = "Test Manufacturer",
            Color = "Blue",
            Batch_Number = "0x0",
            Weight = 10,
            Length = 10,
            Gauge = "20/20",
        };

        // Run controller and verify response
        var result = _controller.AddYarn(request);
        var okRes = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okRes.Value);

        // Verify that the yarn was added
        var yarn = _context.YarnInventory
            .FirstOrDefault(e => e.UserId == testUserId && e.Type == "Linen");
        Assert.NotNull(yarn);
    }

    [Fact]
    public void BadYarnAdd_Fails()
    {
        // Set up request
        var request = new AddYarnRequest
        {
            UserToken = ""
        };

        // Run controller and verify response
        var result = _controller.AddYarn(request);
        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public void FakeTokenAddYarn_Fails()
    {
        // Set up request
        var request = new AddYarnRequest
        {
            UserToken = "fakeToken",
            Type = "Linen",
            Manufacturer = "Test Manufacturer",
            Color = "Blue",
            Batch_Number = "0x0",
            Weight = 10,
            Length = 10,
            Gauge = "20/20",
        };

        // Run controller and verify response
        var result = _controller.AddYarn(request);
        Assert.IsType<UnauthorizedResult>(result);
    }
}