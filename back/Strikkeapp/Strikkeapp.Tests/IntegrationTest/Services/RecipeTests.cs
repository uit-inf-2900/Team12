using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Moq;
using AutoMapper;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Tests.Services;

public class RecipeTests : IDisposable
{
    // Set up the context and service
    private readonly StrikkeappDbContext _context;
    private readonly IRecipeService _recipeService;
    private readonly IConfiguration _mockConfiguration;
    private readonly IMapper _mapper;
    private readonly IRecipeRatingService _ratingService;

    // Create mock services
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly string _mockStoragePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());

    // Test names
    private Guid testUserId = Guid.NewGuid();
    private Guid test2UserId = Guid.NewGuid();
    private Guid testRecipeId = Guid.NewGuid();
    private Guid test2RecipeId = Guid.NewGuid();

    public RecipeTests()
    {
        // Setup AutoMapper configuration
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<AutoMapperProfile>();
        });

        // Set up mocks
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");
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


        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _mapper = mapperConfig.CreateMapper();
        _ratingService = new RecipeRatingService(_context, _mapper);
        _recipeService = new RecipeService(_mockConfiguration, _mockTokenService.Object, _context, _mapper, _ratingService);

        SeedTestData();
    }

    private void SeedTestData()
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

        _context.KnittingRecipes.Add(new KnittingRecipes
        {
            KnittingRecipeId = test2RecipeId,
            UserId = test2UserId,
            RecipeName = "Test Recipe 2",
            NeedleSize = 5,
            KnittingGauge = "10x10",
            Notes = "Test notes",
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

    [Fact]
    public void StoreRecipe_Ok()
    {
        // Set up test data
        var mockFileStream = new Mock<Stream>();
        var recipeName = "New Recipe";
        var needleSize = 5;
        var knittingGauge = "20 stitches = 4 inches";
        var notes = "Some notes here";

        // Run service and verify success
        var result = _recipeService.StoreRecipe(mockFileStream.Object, "userToken", recipeName, needleSize, knittingGauge, notes);
        Assert.True(result.Success, result.ErrorMesssage);

        // Check that the recipe is stored in the database
        var recipe = _context.KnittingRecipes.FirstOrDefault(k => k.RecipeName == recipeName && k.UserId == testUserId);
        Assert.NotNull(recipe);
    }

    [Fact]
    public void WrongConfigStore_Fails()
    {
        // Set up the mock configuration for storage path
        var inMemorySettings = new Dictionary<string, string> 
        {
            {"ConnectionStrings:RecipesStorage", ""}
        };
        var mockConfiguration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        // Run service with wrong configuration and verify failure
        var exception = Assert.Throws<InvalidOperationException>(() => 
        new RecipeService(mockConfiguration, _mockTokenService.Object, _context, _mapper, _ratingService));
        Assert.Equal("Storage path must be configured.", exception.Message);
    }

    [Fact]
    public void FakeTokenStore_Fails()
    {
        // Set up test data
        var mockFileStream = new Mock<Stream>();
        var recipeName = "New Recipe";
        var needleSize = 5;
        var knittingGauge = "20 stitches = 4 inches";
        var notes = "Some notes here";

        // Run service with fake token and verify failure
        var result = _recipeService.StoreRecipe(mockFileStream.Object, "fakeToken", recipeName, needleSize, knittingGauge, notes);
        Assert.False(result.Success);
        Assert.Equal("Unauthorized", result.ErrorMesssage);
    }

    [Fact]
    public void GetRecipes_Ok()
    {
        // Run service and verify success
        var result = _recipeService.GetRecipes("userToken");
        Assert.True(result.Success, result.ErrorMessage);
        Assert.Single(result.Recipes);
        Assert.Equal("Test Recipe", result.Recipes.First().RecipeName);
        
    }

    [Fact]
    public void FakeTokenGet_Fails()
    {
        // Run service with fake token and verify failure
        var result = _recipeService.GetRecipes("fakeToken");
        Assert.False(result.Success);
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void GetRecipePDF_Ok()
    {
        // Run service and verify success
        var result = _recipeService.GetRecipePDF(testRecipeId, "userToken");
        Assert.True(result.Success, result.ErrorMessage);
        Assert.NotNull(result.PDFData);
        Assert.True(result.PDFData.Length > 0);
    }

    [Fact]
    public void FakeTokenGetPDF_Fails()
    {
        // Run service with fake token and verify failure
        var result = _recipeService.GetRecipePDF(testRecipeId, "fakeToken");
        Assert.False(result.Success);
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void InvalidPathGetPDF_Fails()
    {
        // Set up mock
        _mockTokenService.Setup(x => x.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(test2UserId));

        // Run service with entry with invalid path and verify failure
        var result = _recipeService.GetRecipePDF(test2RecipeId, "userToken");
        Assert.False(result.Success);
        Assert.Equal("Recipe not found", result.ErrorMessage);
    }

    [Fact]
    public void NonUserGetPDF_Fails()
    {
        _mockTokenService.Setup(x => x.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        // Run service with non-owner token and verify failure
        var result = _recipeService.GetRecipePDF(testRecipeId, "userToken");
        Assert.False(result.Success);
        Assert.Equal("Unauthorized", result.ErrorMessage);
    }

    [Fact]
    public void NonRecipeGetPDF_Fails()
    {
        // Run service with non-existing recipe and verify failure
        var result = _recipeService.GetRecipePDF(Guid.NewGuid(), "userToken");
        Assert.False(result.Success);
        Assert.Equal("Recipe not found", result.ErrorMessage);
    }

    [Fact]
    public void DeleteRecipe_Ok()
    {
        // Run service and verify success
        var result = _recipeService.DeleteRecipePDF(testRecipeId, "userToken");
        Assert.True(true);

        // Check that the recipe is deleted from the database
        var recipe = _context.KnittingRecipes.FirstOrDefault(k => k.KnittingRecipeId == testRecipeId);
        Assert.Null(recipe);
    }

    [Fact]
    public void FakeTokenDelete_Fails()
    {
        // Run service with fake token and verify failure
        var result = _recipeService.DeleteRecipePDF(testRecipeId, "fakeToken");
        Assert.False(result);

    }

    [Fact]
    public void NonUserDelete_Fails()
    {
        // Set up mock service
        _mockTokenService.Setup(x => x.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        // Run service with non-owner token and verify failure
        var result = _recipeService.DeleteRecipePDF(testRecipeId, "userToken");
        Assert.False(result);
    }
}