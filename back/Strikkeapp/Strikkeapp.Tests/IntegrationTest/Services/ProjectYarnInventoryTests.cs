using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;
using Strikkeapp.Enums;

namespace Strikkeapp.Tests.Services;

public class ProjectYarnInventoryTests : IDisposable
{
    private readonly StrikkeappDbContext _context;
    private readonly ProjectYarnInventoryService _service;
    private readonly InventoryService _inventoryService;
    private readonly IMapper _mapper;

    // Create mock service
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    // Test variables
    private readonly Guid testUserId = Guid.NewGuid();
    private readonly Guid testProjectId = Guid.NewGuid();
    private readonly Guid testProjectYarnInventoryId = Guid.NewGuid();
    private readonly Guid testProjectYarnInventory2Id = Guid.NewGuid();
    private readonly Guid testYarnId = Guid.NewGuid();
    private readonly Guid testYarn2Id = Guid.NewGuid();
    private readonly Guid testNeedleId = Guid.NewGuid();

    public ProjectYarnInventoryTests()
    {
        // Setup AutoMapper configuration
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<AutoMapperProfile>();
        });

        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");
        _mockTokenService.Setup(e => e.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(testUserId));
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

        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _mapper = mapperConfig.CreateMapper();
        _inventoryService = new InventoryService(_context, _mockTokenService.Object, _mapper);
        _service = new ProjectYarnInventoryService(_context, _inventoryService, _mockTokenService.Object, _mapper); 
    
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add stash for user
        _context.NeedleInventory.Add(new NeedleInventory
        {
            ItemID = testNeedleId,
            UserId = testUserId,
            Size = 4,
            Length = 40,
            NumItem = 5,
            NumInUse = 2,
        });
        _context.YarnInventory.Add(new YarnInventory
        {
            ItemID = testYarnId,
            UserId = testUserId,
            Type = "Wool",
            Manufacturer = "SomeBrand",
            Color = "Red",
            NumItems = 5,
            InUse = 2,
        });
        _context.YarnInventory.Add(new YarnInventory
        {
            ItemID = testYarn2Id,
            UserId = testUserId,
            Type = "Linen",
            Manufacturer = "SomeBrand",
            Color = "Blue",
            NumItems = 5,
            InUse = 2,
        });

        // Add project for user
        _context.Projects.Add(new ProjectEntity
        {
            ProjectId = testProjectId,
            Status = ProjectStatus.Ongoing,
            NeedleIds = new List<Guid> { testNeedleId },
            YarnIds = new List<Guid> { testYarnId },
            //ProjectInventoryIds = new List<Guid> { testYarnId },
            UserId = testUserId,
            ProjectName = "TestProject"
        });

        _context.ProjectYarnInventory.Add(new ProjectYarnInventoryEntity
        {
            ProjectInventoryId = testProjectYarnInventoryId, 
            ProjectId = testProjectId,
            ItemId = testYarnId,
            NumberInUse = 2,
            UserId = testUserId
        });
        _context.ProjectYarnInventory.Add(new ProjectYarnInventoryEntity
        {
            ProjectInventoryId = testProjectYarnInventory2Id, 
            ProjectId = testProjectId,
            ItemId = testYarn2Id,
            NumberInUse = 2,
            UserId = testUserId
        });

        _context.SaveChanges();
    }


    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public void FakeTokenCreateYarnInv_Fails()
    {   
        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() =>_service.CreateYarnInventory(testYarnId, testProjectId, "fakeToken", 1));
    }

    [Fact]
    public void FakeIdCreateYarnInvs_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<Exception>(() => _service.CreateYarnInventory(Guid.NewGuid(), Guid.NewGuid(), "userToken", 1));
    }

    [Fact]
    public void FakeTokenDeleteSingleYarn_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() => _service.DeleteYarnInventory(testProjectId, "fakeToken"));
    }

    [Fact]
    public void SingleYarnDelete_Ok()
    {
        // Run service
        var result =_service.DeleteYarnInventory(testProjectYarnInventoryId, "userToken");
        Assert.True(result);
    }

    [Fact]
    public void MultipoleYarnDelte_Ok()
    {
        // Run service
        var result = _service.DeleteYarnInventory(new List<Guid> { testProjectYarnInventoryId, testProjectYarnInventory2Id }, "userToken");
        Assert.True(result);
    }

    [Fact]
    public void SingleNonProjectDelete_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<Exception>(() => _service.DeleteYarnInventory(Guid.NewGuid(), "userToken"));
    }

    [Fact]
    public void NonProjectDeleteSingle_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<Exception>(() => _service.DeleteYarnInventory(Guid.NewGuid(), "userToken"));

    }

    [Fact]
    public void FakeTokenDeleteMultipleYarn_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() => _service.DeleteYarnInventory(new List<Guid> { testProjectId }, "fakeToken"));
    }

    [Fact]
    public void SetYarnInventorySingle_Ok()
    {
        // Run service
        var result = _service.SetYarnInventoryForCompletedProject("userToken", testYarnId, testProjectId);
        Assert.True(result);
    }

    [Fact]
    public void FakeTokenSetSingle_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() => _service.SetYarnInventoryForCompletedProject("fakeToken", testYarnId, testProjectId));
    }

    [Fact]
    public void FakeTokenSetMultiple_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() => _service.SetYarnInventoryForCompletedProject("fakeToken", new List<Guid> { testYarnId }, testProjectId));
    }

    [Fact]
    public void CreateYarnInventory_DictOk()
    {
        Dictionary<Guid, int> yarns = new Dictionary<Guid, int>
        {
            { testYarnId, 2 }
        };

        // Run service
        var result = _service.CreateYarnInventory(yarns, testProjectId, "userToken");
        Assert.NotNull(result);
    }

    [Fact]
    public void FakeTokenCreate_DictFails()
    {
        Dictionary<Guid, int> yarns = new Dictionary<Guid, int>
        {
            { testYarnId, 2 }
        };

        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() => _service.CreateYarnInventory(yarns, testProjectId, "fakeToken"));
    }

    [Fact]
    public void TooManyCreate_DictFails()
    {
        // Create dictionary with too many yarns
        Dictionary<Guid, int> yarns = new Dictionary<Guid, int>
        {
            { testYarnId, 100}   
        };

        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() => _service.CreateYarnInventory(yarns, testProjectId, "userToken"));
    }

    [Fact]
    public void FakeTokenGetInUse_Fails()
    {
        // Run service and verify assertion
        Assert.Throws<ArgumentException>(() => _service.GetNumInUseByProject(testYarnId, testProjectId, "fakeToken"));
    }
}
