using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using System.Text;
using AutoMapper;


using Strikkeapp.Controllers;
using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Recipes.Models;
using Morcatko.AspNetCore.JsonMergePatch.NewtonsoftJson.Builders;



namespace Strikkeapp.Tests.Controllers;

public class RecipeControllerTests : IDisposable
{
    // Initialize db, controller and services
    private readonly RecipeController _controller;
    private readonly RecipeService _recipeService;
    private readonly StrikkeappDbContext _context;
    private readonly IConfiguration _mockConfiguration;
    private readonly IMapper _mapper;
    private readonly IRecipeRatingService _ratingService;

    // Set up mocks
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly string _mockStoragePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());

    // Test data
    private Guid testUserId = Guid.NewGuid();
    private Guid testRecipeId = Guid.NewGuid();
    private Guid testAdminId = Guid.NewGuid();

    public RecipeControllerTests()
    {
        // Setup AutoMapper configuration
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<AutoMapperProfile>();
        });

        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
            .Returns("hashedPassword");

        _mockTokenService.Setup(x => x.ExtractUserID("adminToken"))
            .Returns(TokenResult.ForSuccess(testAdminId));
        _mockTokenService.Setup(x => x.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(testUserId));
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        // Set up in-memory database
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        // Set up the mock configuration for storage path
        var inMemorySettings = new Dictionary<string, string> 
        {
            {"ConnectionStrings:RecipesStorage", _mockStoragePath}
        };
        _mockConfiguration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        // Set up context, service and controller
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _mapper = mapperConfig.CreateMapper();
        _ratingService = new RecipeRatingService(_context, _mapper);
        _recipeService = new RecipeService(_mockConfiguration, _mockTokenService.Object, _context, _mapper, _ratingService);
        _controller = new RecipeController(_recipeService);

        // Seed database
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Ensure the storage path exists. If not, create it
        if (!Directory.Exists(_mockStoragePath))
        {
            Directory.CreateDirectory(_mockStoragePath);
        }

        // Create a test recipe
        var recipeFilePath = Path.Combine(_mockStoragePath, $"{testRecipeId}.pdf");
        File.WriteAllBytes(recipeFilePath, new byte[] { 1, 2, 3, 4, 5 });

        _context.KnittingRecipes.Add(new KnittingRecipes
        {
            KnittingRecipeId = testRecipeId,
            UserId = testUserId,
            RecipeName = "Test Recipe",
            NeedleSize = 5,
            KnittingGauge = "10x10",
            Notes = "Test notes",
            RecipePath = recipeFilePath
        });

        // Add test user to database
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
        // Add test admin to database
        _context.UserLogIn.Add(new UserLogIn
        {
            UserId = testAdminId,
            UserEmail = "admin@knithub.no",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        });
        _context.UserDetails.Add(new UserDetails
        {
            UserId = testAdminId,
            UserFullName = "Admin User",
            DateOfBirth = DateTime.Now,
            IsAdmin = true
        });

        _context.SaveChanges();
    }

    public void Dispose()
    {
        // Delete the created PDF file
        var recipeFilePath = Path.Combine(_mockStoragePath, $"{testRecipeId}.pdf");
        if (File.Exists(recipeFilePath))
        {
            File.Delete(recipeFilePath);
        }

        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    // Helper method to create a mock form file
    private Mock<IFormFile> CreateMockFormFile(string fileName, string contentType, byte[] content)
    {
        // Create a mock form file
        var fileMock = new Mock<IFormFile>();
        var ms = new MemoryStream(content);
        ms.Position = 0; 

        // Set up the mock behavior
        fileMock.Setup(_ => _.OpenReadStream()).Returns(ms);
        fileMock.Setup(_ => _.FileName).Returns(fileName);
        fileMock.Setup(_ => _.Length).Returns(ms.Length);
        fileMock.Setup(_ => _.ContentType).Returns(contentType);

        return fileMock;
    }

    [Fact]
    public void UploadRecipe_Ok()
    {
        // Set up test data
        var mockFile = CreateMockFormFile("test.pdf", "application/pdf", Encoding.UTF8.GetBytes("Dummy PDF content"));
        var formData = new RecipeController.FormData
        {
            UserToken = "userToken",
            RecipeName = "New Recipe",
            NeedleSize = 5,
            KnittingGauge = "10x10",
            Notes = "Test notes",
            RecipeFile = mockFile.Object
        };

        // Call controller and verify success
        var result = _controller.UploadRecipe(formData);
        Assert.IsType<CreatedResult>(result);
    }

    [Fact]
    public void BadReuqstUpload_Fails()
    {
        // Set up test data
        var request = new RecipeController.FormData{};

        // Call controller and verify failure
        var result = _controller.UploadRecipe(request);
        Assert.IsType<BadRequestObjectResult>(result);
    }
    
    [Fact]
    public void FakeTokenUpload_Fails()
    {
        // Set up test data
        var mockFile = CreateMockFormFile("test.pdf", "application/pdf", Encoding.UTF8.GetBytes("Dummy PDF content"));
        var formData = new RecipeController.FormData
        {
            UserToken = "fakeToken",
            RecipeName = "New Recipe",
            NeedleSize = 5,
            KnittingGauge = "10x10",
            Notes = "Test notes",
            RecipeFile = mockFile.Object
        };

        // Call controller and verify failure
        var result = _controller.UploadRecipe(formData);
        var response = Assert.IsType<ObjectResult>(result);
        Assert.Equal(422, response.StatusCode);
    }

    [Fact]
    public void GetRecipes_Ok()
    {
        // Call controller and verify success
        var result = _controller.GetRecipes("userToken");
        var okRes = Assert.IsType<OkObjectResult>(result);

        // Verify response
        var recipes = Assert.IsType<List<RecipeInfo>>(okRes.Value);
        Assert.Single(recipes);
        Assert.Equal("Test Recipe", recipes.First().RecipeName);
    }

    [Fact]
    public void FakeTokenGetRecipes_Fails()
    {
        // Call controller and verify failure
        var result = _controller.GetRecipes("fakeToken");
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public void GetRecipePDF_Ok()
    {
        // Call controller and verify success
        var result = _controller.GetRecipePDF("userToken", testRecipeId);
        var fileRes = Assert.IsType<FileContentResult>(result);

        // Verify response
        Assert.Equal("application/pdf", fileRes.ContentType);
        Assert.True(fileRes.FileContents.Length > 0);
    }

    [Fact]
    public void FakeTokenGetPDF_Fails()
    {
        // Call controller and verify failure
        var result = _controller.GetRecipePDF("fakeToken", testRecipeId);
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public void NonRecipeGetPDF_Fails()
    {
        // Call controller and verify failure
        var result = _controller.GetRecipePDF("userToken", Guid.NewGuid());
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void DeleteRecipe_Ok()
    {
        // Call controller and verify success
        var result = _controller.DeleteRecipePDF("userToken", testRecipeId);
        Assert.IsType<OkResult>(result);

        // Verify recipe is deleted
        var recipe = _context.KnittingRecipes.Find(testRecipeId);
        Assert.Null(recipe);
    }

    [Fact]
    public void NonRecipeDelete_Fails()
    {
        // Call controller and verify failure
        var result = _controller.DeleteRecipePDF("userToken", Guid.NewGuid());
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void PatchRecipe_Ok()
    {
        var patch = PatchBuilder.Build<RecipePatch>("{ \"RecipeName\": \"New Name\" }");
        var result = _controller.PatchRecipe(testRecipeId, "userToken", patch);
        Assert.NotNull(result);
    }
}