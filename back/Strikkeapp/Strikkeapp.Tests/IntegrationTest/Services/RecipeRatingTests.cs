using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using Moq;

using Strikkeapp.Services;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Data.Dto;
using Microsoft.Identity.Client;

namespace Strikkeapp.Tests.Services;

public class RecipeRatingTests : IDisposable
{
    // Set up db and service to test
    private readonly StrikkeappDbContext _context;
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

    public RecipeRatingTests()
    {
        // Setup AutoMapper configuration
        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<AutoMapperProfile>();
        });

        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);
        _mapper = mapperConfig.CreateMapper();
        _recipeRatingService = new RecipeRatingService(_context, _mapper);

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
    public void PostRating_Ok()
    {
        // Run service and verify result
        var result = _recipeRatingService.PostRating(testRecipe2Id, Enums.Rating.Five, testUserId);
        Assert.NotNull(result);

        // Run service for existing rating and verify result
        var result2 = _recipeRatingService.PostRating(testRecipeId, Enums.Rating.One, testUserId);
        Assert.NotNull(result2);
    }

    [Fact]
    public void Ok()
    {
        // Run service and verify result
        var result = _recipeRatingService.GetRating(testRecipeId, testUserId);
        Assert.NotNull(result);

        // Run service for non-existing rating and verify result
        var result2 = _recipeRatingService.GetRating(testRecipe2Id, testUserId);
        Assert.NotNull(result2);
        
    }
}