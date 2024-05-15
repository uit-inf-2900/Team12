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

namespace Strikkeapp.Tests.Controllers;

public class RecipeRatingControllerTests : IDisposable
{
    // Set up db and service to test
    private readonly StrikkeappDbContext _context;
    private readonly RecipeRatingController _recipeRatingController;
    private readonly RecipeRatingService _recipeRatingService;
    private readonly IMapper _mapper;


    // Create mock service
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    // Test data
    private Guid testUserId = Guid.NewGuid();
    private Guid testRecipeId = Guid.NewGuid();
    private Guid testRecipe2Id = Guid.NewGuid();
    private Guid testRatingId = Guid.NewGuid(); 

    public RecipeRatingControllerTests()
    {
        // Setup AutoMapper configuration
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<AutoMapperProfile>();
        });

        // Set up mock services
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
            .Returns("hashedPassword");
        _mockTokenService.Setup(x => x.ExtractUserID("userToken"))
            .Returns(TokenResult.ForSuccess(testUserId));
        _mockTokenService.Setup(x => x.ExtractUserID("fakeToken"))
            .Returns(TokenResult.ForFailure("Unauthorized"));

        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning)
            .Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _mapper = mapperConfig.CreateMapper();
        _recipeRatingService = new RecipeRatingService(_context, _mapper);
        _recipeRatingController = new RecipeRatingController(_recipeRatingService, _mockTokenService.Object);

        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add user
        _context.UserLogIn.Add(new UserLogIn
        {
            UserId = testUserId,
            UserPwd = "HashedPassword",
            UserEmail = "test@email.com",
            UserStatus = "verified"
        });
        _context.UserDetails.Add(new UserDetails
        {
            UserId = testUserId,
            UserFullName = "Test User",
            DateOfBirth = DateTime.Now,
            IsAdmin = false
        });

        // Add knitting recipe without rating
        _context.KnittingRecipes.Add(new KnittingRecipes
        {
            KnittingRecipeId = testRecipe2Id,
            UserId = testUserId,
            RecipeName = "Test Recipe 2",
            NeedleSize = 4,
            KnittingGauge = "10x10",
            Notes = "Test notes 2"
        });

        // Add knitting recipe with rating
        _context.KnittingRecipes.Add(new KnittingRecipes
        {
            KnittingRecipeId = testRecipeId,
            UserId = testUserId,
            RecipeName = "Test Recipe",
            NeedleSize = 4,
            KnittingGauge = "10x10",
            Notes = "Test notes"
        });

        _context.RecipeRatings.Add(new RecipeRatingEntity
        {
            RecipeRatingId = testRatingId,
            RecipeId = testRecipeId,
            UserId = testUserId,
            Rating = Enums.Rating.Five
        });

        _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public void RateRecipe_Ok()
    {
        // Run controller for both recipes and verify result
        var result = _recipeRatingController.RateRecipe(testRecipeId, Enums.Rating.Five, "userToken");
        Assert.NotNull(result);

        var result2 = _recipeRatingController.RateRecipe(testRecipe2Id, Enums.Rating.Five, "userToken");
        Assert.NotNull(result2);
    }

    [Fact]
    public void FakeTokenRate_Fails()
    {
        // Run controller with fake token and verify exception
        Assert.Throws<UnauthorizedAccessException>(() => _recipeRatingController.RateRecipe(testRecipeId, Enums.Rating.Five, "fakeToken"));
    }

    [Fact]
    public void GetRating_Ok()
    {
        // Run controller for both recipes and verify result
        var result = _recipeRatingController.GetRating(testRecipeId, "userToken");
        Assert.NotNull(result);

        var result2 = _recipeRatingController.GetRating(testRecipe2Id, "userToken");
        Assert.NotNull(result2);
    }

    [Fact]
    public void FakeTokenGet_Fails()
    {
        // Run controller with fake token and verify exception
        Assert.Throws<UnauthorizedAccessException>(() => _recipeRatingController.GetRating(testRecipeId, "fakeToken"));
    }
}