using System.Xml.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Tests;

public class InventoryTests : IDisposable
{
    // Set up db context and service to test
    private readonly StrikkeappDbContext _context;
    private readonly InventoryService _inventoryService;

    // Create mock service
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    private Guid testUserGuid = Guid.NewGuid();
    private Guid testNeedleId = Guid.NewGuid();
    private Guid testYarnId = Guid.NewGuid();

    public InventoryTests()
    {
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);

        _inventoryService = new InventoryService(_context, _mockTokenService.Object);

        SeedTestData();
    }

    private void SeedTestData()
    {
        var testNeedleInventory = new NeedleInventory
        {
            ItemID = testNeedleId,
            UserId = testUserGuid,
            Type = "Round",
            Size = 10,
            Length = 10,
            NumItem = 5,
            NumInUse = 1
        };
        _context.NeedleInventory.Add(testNeedleInventory);

        var testYarnInventory = new YarnInventory
        {
            ItemID = testYarnId,
            UserId = testUserGuid,
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
        };
        _context.YarnInventory.Add(testYarnInventory);

        _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public void GetInventory_Ok()
    {
        // Test data
        var testJwtToken = "testToken";

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.GetInventory(testJwtToken);

        // Assert if service fails
        Assert.True(res.Success);

        // Assert if more then one entry in inventories
        Assert.Single(res.NeedleInventories);
        Assert.Single(res.YarnInventories);

        // Verify yarn inventory match database
        var yarnInventory = res.YarnInventories.FirstOrDefault();
        Assert.NotNull(yarnInventory);
        Assert.Equal("Wool", yarnInventory.Type);
        Assert.Equal("Test Manufacturer", yarnInventory.Manufacturer);
        Assert.Equal(10, yarnInventory.Weight);
        Assert.Equal(10, yarnInventory.Length);
        Assert.Equal("20/20", yarnInventory.Gauge);
        Assert.Equal(5, yarnInventory.NumItems);
        Assert.Equal(1, yarnInventory.InUse);
        Assert.Equal("Test Note", yarnInventory.Notes);

        // Veridy needle inventory match database
        var needleInventory = res.NeedleInventories.FirstOrDefault();
        Assert.NotNull(needleInventory);
        Assert.Equal("Round", needleInventory.Type);
        Assert.Equal(10, needleInventory.Size);
        Assert.Equal(10, needleInventory.Length);
        Assert.Equal(5, needleInventory.NumItem);
        Assert.Equal(1, needleInventory.NumInUse);
    }

    [Fact]
    public void FakeTokenGet_Fails()
    {
        // Set up test data and mock service
        var fakeToken = "fakeToke";
        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));


        // Run service and check correct error
        var res = _inventoryService.GetInventory(fakeToken);

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void AddNeedle_Ok()
    {
        var testRequest = new AddNeedleRequest
        {
            UserToken = "testToken",
            Type = "Set",
            Size = 3,
            Length = 10
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.AddNeedle(testRequest);

        Assert.True(res.Success);
        Assert.NotEqual(Guid.Empty, res.ItemId);
    }

    [Fact]
    public void FakeTokenAddNeedle_Fails()
    {
        // Set up test data and mock service
        var fakeToken = "fakeToke";

        var request = new AddNeedleRequest
        {
            UserToken = fakeToken,
            Type = "Some type",
            Size = 10,
            Length = 10
        };

        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));


        // Run service and check correct error
        var res = _inventoryService.AddNeedle(request);

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void IncreaseingNeedle_Ok()
    {
        var testRequest = new UpdateItemRequest
        {
            UserToken = "testToken",
            ItemId = testNeedleId,
            NewNum = 69
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.UpdateNeedle(testRequest);

        Assert.True(res.Success);
        Assert.Equal(res.ItemId, testNeedleId);
        Assert.Equal(res.NewNum, testRequest.NewNum);
    }

    [Fact]
    public void IncreaseNeedlesInUse_Ok()
    {
        var testRequest = new UpdateItemRequest
        {
            ItemId = testNeedleId,
            UserToken = "testToken"
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.UpdateNeedlesUsed(testRequest);

        // Assert if service fails
        Assert.True(res.Success);
        // Assert is mismatch between request and response
        Assert.Equal(testRequest.ItemId, res.ItemId);
        Assert.Equal(testRequest.NewNum, res.NewUsed);
    }

    [Fact]
    public void FakeTokenUpdateNeedle_Fails()
    {
        // Set up test data and mock service
        var fakeToken = "fakeToke";
        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run test for updating single needle and check that it fails
        var updateNeedle = _inventoryService.UpdateNeedle(new UpdateItemRequest
        {
            ItemId = testNeedleId,
            UserToken = fakeToken
        });
        Assert.False(updateNeedle.Success, "Service should fail with fake token");

        // Run test for updating needles in use and check that it fails
        var updateNeedlesUsed = _inventoryService.UpdateNeedlesUsed(new UpdateItemRequest
        {
            UserToken = fakeToken,
            ItemId = testNeedleId,
            NewNum = 69
        });
        Assert.False(updateNeedlesUsed.Success, "Service should fail with fake token");
    }
    [Fact]
    public void UpdateNonExistingNeedle_Fails()
    {
        // Set up test data and mock service
        var testToken = "testToken";
        var fakeItemId = Guid.NewGuid();

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run test
        var res = _inventoryService.UpdateNeedle(new UpdateItemRequest {
            ItemId = fakeItemId,
            UserToken = testToken
        });

        // Check that service fails with correct error
        Assert.False(res.Success, "Service should fail with fake item id");
        Assert.Equal("Item not found", res.ErrorMessage);
    }

    [Fact]
    public void UpdatingNonExistingNeedles_Fails()
    {
        // Set up test data and mock service
        var testToken = "testToken";
        var fakeItemId = Guid.NewGuid();

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run test
        var res = _inventoryService.UpdateNeedlesUsed(new UpdateItemRequest {
            ItemId = fakeItemId,
            UserToken = testToken
        });

        // Check that service fails with correct error
        Assert.False(res.Success, "Service should fail with fake item id");
        Assert.Equal("Item not found for user", res.ErrorMessage);
    }

    [Fact]
    public void ExceedingNeedlesInInventory_Fails()
    {
        // Set up test data and mock service
        var testToken = "testToken";

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run test
        var res = _inventoryService.UpdateNeedlesUsed(new UpdateItemRequest {
            ItemId = testNeedleId,
            UserToken = testToken,
            NewNum = 100
        });

        // Check that service fails with correct error
        Assert.False(res.Success, "Service should fail with too high number");
        Assert.Equal("Exceeded inventory", res.ErrorMessage);
    }
    

    [Fact]
    public void DeleteNeedle_Ok()
    {
        var testRequest = new DeleteItemRequest
        {
            ItemId = testNeedleId,
            UserToken = "testToken"
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.DeleteNeedle(testRequest);

        Assert.True(res.Success);
        Assert.Equal(res.ItemId, testRequest.ItemId);
        // Make sure database is empty after deletion
        Assert.Empty(_context.NeedleInventory);
    }

    [Fact]
    public void FakeTokenDeleteNeedle_Fails()
    {
        // Set up test data and mock service
        var fakeToken = "fakeToken";

        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run service and check correct error
        var res = _inventoryService.DeleteNeedle(new DeleteItemRequest
        {
            ItemId = testNeedleId,
            UserToken = fakeToken
        });

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void DeletingNonExistingNeedle_Fails()
    {
        // Set up test data and mock service
        var testToken = "testToken";
        var fakeItemId = Guid.NewGuid();

        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        // Run test
        var res = _inventoryService.DeleteNeedle(new DeleteItemRequest {
            ItemId = fakeItemId,
            UserToken = testToken
        });

        // Check that service fails with correct error
        Assert.False(res.Success, "Service should fail with fake item id");
        Assert.Equal("Item not found for user", res.ErrorMessage);
    }


    [Fact]
    public void AddYarn_Ok() 
    {
        var testRequest = new AddYarnRequest
        {
            UserToken = "testToken",
            Type = "Mohair",
            Manufacturer = "Some Manufacturer",
            Color = "White",
            Batch_Number = "1x0",
            Weight = 6,
            Length = 210,
            Gauge = "30/40",
            Notes = "Some note"
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.AddYarn(testRequest);

        Assert.True(res.Success);
        Assert.NotEqual(Guid.Empty, res.ItemId);
    }

    [Fact]
    public void FakeTokenAddYarn_Fails()
    {
        // Set up test data and mock service
        var fakeToken = "fakeToke";

        var request = new AddYarnRequest
        {
            UserToken = fakeToken,
            Type = "Some type",
            Manufacturer = "Some Manufacturer",
            Color = "Some color",
        };

        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));


        // Run service and check correct error
        var res = _inventoryService.AddYarn(request);

        Assert.False(res.Success);
        Assert.Equal("Unauthorized", res.ErrorMessage);
    }

    [Fact]
    public void IncreasingYarn_Ok() 
    {
        var testRequest = new UpdateYarnRequest
        {
            UserToken = "testToken",
            ItemId = testYarnId,
            NewNum = 69
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.UpdateYarn(testRequest);

        Assert.True(res.Success);
        // Assert is mismatch between request and response
        Assert.Equal(res.ItemId, testRequest.ItemId);
        Assert.Equal(res.NewNum, testRequest.NewNum);
    }

    [Fact]
    public void IncreseYarnInUse_Ok()
    {
        var testRequest = new UpdateItemRequest
        {
            ItemId = testYarnId,
            UserToken = "testToken",
            NewNum = 3
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.UpdateYarnUsed(testRequest);

        Assert.True(res.Success);
        // Assert is mismatch between request and response
        Assert.Equal(testRequest.ItemId, res.ItemId);
        Assert.Equal(testRequest.NewNum, res.NewUsed);
    }

    [Fact]
    public void FakeTokenUpdateYarn_Fails()
    {
        // Set up test data and mock service
        var fakeToken = "fakeToken";

        _mockTokenService.Setup(s => s.ExtractUserID(fakeToken))
            .Returns(TokenResult.ForFailure("Invalid token"));

        // Run test for updating single yarn and check that it fails
        var updateYarn = _inventoryService.UpdateYarn(new UpdateYarnRequest
        {
            ItemId = testYarnId,
            UserToken = fakeToken
        });

        Assert.False(updateYarn.Success, "Service should fail with fake token");

        // Run test for updating yarns in use and check that it fails
        var updateYarnsUsed = _inventoryService.UpdateYarnUsed(new UpdateItemRequest
        {
            UserToken = fakeToken,
            ItemId = testYarnId,
            NewNum = 69
        });

        Assert.False(updateYarnsUsed.Success, "Service should fail with fake token");
    }

    [Fact]
    public void DeleteYarn_Ok() 
    {
        var testRequest = new DeleteItemRequest
        {
            ItemId = testYarnId,
            UserToken = "testToken"
        };

        // Set up mock service
        _mockTokenService.Setup(s => s.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserGuid));

        var res = _inventoryService.DeleteYarn(testRequest);

        // Assert if service fails
        Assert.True(res.Success);
        Assert.Equal(res.ItemId, testRequest.ItemId);
        // Make sure database is empty after deletion
        Assert.Empty(_context.YarnInventory);
    }

}
