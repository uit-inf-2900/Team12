using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Moq;

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

    // Create mock services
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly string _mockStoragePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());

    private Guid testUserId = Guid.NewGuid();

    public RecipeTests()
    {
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
        _recipeService = new RecipeService(_mockConfiguration, _mockTokenService.Object, _context);

        SeedTestData();
    }

    private void SeedTestData()
    {
        _context.KnittingRecipes.Add(new KnittingRecipes
        {
            KnittingRecipeId = Guid.NewGuid(),
            UserId = testUserId,
            RecipeName = "Test Recipe",
            NeedleSize = 5,
            KnittingGauge = "10x10",
            Notes = "Test notes"
        });
    }

    public void Dispose()
    {
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
            new RecipeService(mockConfiguration, _mockTokenService.Object, _context));
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



        // Run servicewith fake token and verify failure
        var result = _recipeService.StoreRecipe(mockFileStream.Object, "fakeToken", recipeName, needleSize, knittingGauge, notes);
        Assert.False(result.Success);
        Assert.Equal("Unauthorized", result.ErrorMesssage);
    }
}