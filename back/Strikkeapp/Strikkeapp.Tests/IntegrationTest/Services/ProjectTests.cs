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

public class ProjectTests : IDisposable
{
    // Set up db and services
    private readonly StrikkeappDbContext _context;
    private readonly ProjectService _projectService;
    private readonly ProjectYarnInventoryService _projectYarnInventoryService;
    private readonly InventoryService _inventoryService;
    private readonly IMapper _mapper;

    // Create mock service
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    private readonly Guid testUserId = Guid.NewGuid();
    private readonly Guid testProjectId = Guid.NewGuid();
    private readonly Guid testYarnId = Guid.NewGuid();
    private readonly Guid testNeedleId = Guid.NewGuid();

    public ProjectTests()
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
        _projectYarnInventoryService = new ProjectYarnInventoryService(_context, _inventoryService, _mockTokenService.Object, _mapper);
        _projectService = new ProjectService(_mockTokenService.Object, _context, _projectYarnInventoryService, _inventoryService, _mapper);


        // Seed database
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

        _context.ProjectYarnInventory.Add(new ProjectYarnInventoryEntity
        {
            ProjectId = testProjectId,
            ItemId = testYarnId,
            NumberInUse = 2,
            UserId = testUserId
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
    public void FakeTokenGetProject_Fails()
    {
        // Verify that the fake token fails
        Assert.Throws<ArgumentException>(() => _projectService.GetProject("fakeToken", testProjectId));
    }

    [Fact]
    public void NonProjectGet_Fails()
    {
        Guid fakeId = Guid.NewGuid();

        // Verify that the fake project id fails
        Assert.Throws<ArgumentException>(() => _projectService.GetProject("userToken", fakeId));
    }

    [Fact]
    public void FakeTokenCreate_Fails()
    {
        // Verify that the fake token fails
        Assert.Throws<ArgumentException>(() => _projectService.CreateProject("fakeToken", new ProjectCreateModel()));
    }

    [Fact]
    public void CreateProjectCompleted_Fails()
    {
        // Create new project
        var project = new ProjectCreateModel
        {
            ProjectName = "NewProject",
            Status = ProjectStatus.Completed,
        };

        // Verify that the project creation fails
        Assert.Throws<Exception>(() => _projectService.CreateProject("userToken", project));
    }

    [Fact]
    public void CreateProject_Ok()
    {
        // Create new project
        var project = new ProjectCreateModel
        {
            ProjectName = "NewProject",
            Status = ProjectStatus.Ongoing,
            NeedleIds = new List<Guid> { testNeedleId },
            YarnIds = new Dictionary<Guid, int> { { testYarnId, 2 } }
        };

        // Run service
        var result = _projectService.CreateProject("userToken", project);
        Assert.True(result);
    }

    [Fact]
    public void CreateProjectNonYarn_Fails()
    {
        // Create new project
        var project = new ProjectCreateModel
        {
            ProjectName = "NewProject",
            Status = ProjectStatus.Ongoing,
            NeedleIds = new List<Guid> { testNeedleId },
            YarnIds = new Dictionary<Guid, int> { { Guid.NewGuid(), 2 } }
        };

        // Verify that the project creation fails
        Assert.Throws<Exception>(() => _projectService.CreateProject("userToken", project));
    }

    [Fact]
    public void OverInventoryYanCreateProject_Fails()
    {
        // Create new project
        var project = new ProjectCreateModel
        {
            ProjectName = "NewProject",
            Status = ProjectStatus.Ongoing,
            NeedleIds = new List<Guid> { testNeedleId },
            YarnIds = new Dictionary<Guid, int> { { testYarnId, 100 } }
        };

        // Verify that the project creation fails
        Assert.Throws<ArgumentException>(() => _projectService.CreateProject("userToken", project));
    }

    [Fact]
    public void FakeTokenDeleteProject_Fails()
    {
        // Verify that the fake token fails
        Assert.Throws<ArgumentException>(() => _projectService.DeleteProject(testProjectId, "fakeToken"));
    }   

    [Fact]
    public void NonProjectDelete_Fails()
    {
        Guid fakeId = Guid.NewGuid();

        // Verify that the fake project id fails
        Assert.Throws<ArgumentException>(() => _projectService.DeleteProject(fakeId, "userToken"));
    }

        
}