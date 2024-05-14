using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using AutoMapper;
using Morcatko.AspNetCore.JsonMergePatch;

using Strikkeapp.Controllers;
using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;
using Strikkeapp.Data.Entities;
using Strikkeapp.Enums;

namespace Strikkeapp.Services;

public class ProjectControllerTests
{
    private readonly ProjectController _controller;
    private readonly ProjectService _projectService;
    private readonly ProjectYarnInventoryService _projectYarnInventoryService;
    private readonly InventoryService _inventoryService;
    private readonly StrikkeappDbContext _context;
    private readonly IMapper _mapper;

        // Set up mocks
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();


    private readonly Guid testUserId = Guid.NewGuid();
    private readonly Guid testProjectId = Guid.NewGuid();
    private readonly Guid testYarnId = Guid.NewGuid();
    private readonly Guid testNeedleId = Guid.NewGuid();

    public ProjectControllerTests()
    {
        // Setup AutoMapper configuration
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<AutoMapperProfile>();
        });

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

        // Set up context and mapper
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _mapper = mapperConfig.CreateMapper();
        // Set up services
        _inventoryService = new InventoryService(_context, _mockTokenService.Object, _mapper);
        _projectYarnInventoryService = new ProjectYarnInventoryService(_context, _inventoryService, _mockTokenService.Object, _mapper);
        _projectService = new ProjectService(_mockTokenService.Object, _context, _projectYarnInventoryService, _inventoryService, _mapper);
        // Set up controller
        _controller = new ProjectController(_projectService);

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

    [Fact]
    public void GetProjects_Ok()
    {
        // Run controller
        var result = _controller.GetProjects("userToken");
        Assert.IsType<List<ProjectModel>>(result);
        Assert.Single(result);
    }

    [Fact]
    public void FakeTokenGetProjects_Fail()
    {
        // Run controller and verify exception
        Assert.Throws<ArgumentException>(() => _controller.GetProjects("fakeToken"));
    }

    [Fact]
    public void GetSingleProject_Ok()
    {
        // Run controller
        var result = _controller.GetProject(testProjectId, "userToken");
        Assert.IsType<ProjectModel>(result);
        Assert.Equal(testProjectId, result.ProjectId);
    }

    [Fact]
    public void PostProject_Ok()
    {
        // Create new project
        var project = new ProjectCreateModel
        {
            ProjectName = "NewProject",
            Status = ProjectStatus.Ongoing,
        };

        // Run controller
        var result = _controller.PostProject("userToken", project);
        Assert.True(result);

        // Verify project was added
        var projectEntity = _context.Projects.Where(p => p.ProjectName == "NewProject")
            .FirstOrDefault();
        Assert.NotNull(projectEntity);
    }

}