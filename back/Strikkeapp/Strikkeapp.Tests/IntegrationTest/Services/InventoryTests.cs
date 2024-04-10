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

    private Guid testUserGuid = Guid.NewGuid();
    private Guid testNeedleId = Guid.NewGuid();
    private Guid testYarnId = Guid.NewGuid();

    public InventoryTests()
    {
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new StrikkeappDbContext(options);

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
    public void IncreaseNeedleItem()
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

}
