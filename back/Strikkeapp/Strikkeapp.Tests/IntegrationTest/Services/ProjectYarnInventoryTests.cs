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
    private readonly Guid testYarnId = Guid.NewGuid();
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

        // Add project for user
        _context.Projects.Add(new ProjectEntity
        {
            ProjectId = testProjectId,
            Status = ProjectStatus.Ongoing,
            NeedleIds = new List<Guid> { testNeedleId },
            YarnIds = new List<Guid> { testYarnId },
            ProjectInventoryIds = new List<Guid> { testYarnId },
            UserId = testUserId,
            ProjectName = "TestProject"
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
        Assert.Throws<ArgumentException>(() =>_service.CreateYarnInventory(testYarnId, testProjectId, "fakeToken", 1));
    }
}
