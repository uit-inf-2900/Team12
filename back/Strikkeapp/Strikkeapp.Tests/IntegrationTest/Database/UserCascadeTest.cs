using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Tests;

public class UserCascadeTest
{
    private readonly StrikkeappDbContext _context;
    private readonly IUserService _userService;

    // Create mock service
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();

    private Guid testUserId = Guid.NewGuid();
    public UserCascadeTest()
    {
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");
        
        // Set up db with unique name
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _context = new StrikkeappDbContext(options, _mockPasswordHasher.Object);

        _userService = new UserService(_context, _mockTokenService.Object, _mockPasswordHasher.Object);

        SeedTestData();
    }

    private void SeedTestData()
    {
        var login = new UserLogIn
        {
            UserId = testUserId,
            UserEmail = "test@example.com",
            UserPwd = "hashedPassword",
            UserStatus = "verified"
        };
        _context.UserLogIn.Add(login);

        var details = new UserDetails
        {
            UserId = testUserId,
            UserFullName = "Test User",
            DateOfBirth = DateTime.Now.AddYears(-30),
            IsAdmin = false
        };
        _context.UserDetails.Add(details);

        var verification = new UserVerification
        {
            UserId = testUserId,
        };
        _context.UserVerification.Add(verification);

        var Recipe = new KnittingRecipes
        {
            UserId = testUserId,
            RecipeName = "Test Recipe",
            NeedleSize = 10,
            KnittingGauge = "10/10"
        };
        _context.KnittingRecipes.Add(Recipe);

        var counter = new Counter
        {
            UserId = testUserId,
            Name = "Test Counter",
            RoundNumber = 10
        };
        _context.CounterInventory.Add(counter);

        var needle = new NeedleInventory
        {
            UserId = testUserId,
            Type = "Round",
            Size = 10,
            Length = 10,
            NumItem = 1,
            NumInUse = 0
        };
        _context.NeedleInventory.Add(needle);

        var yarn = new YarnInventory
        {
            UserId = testUserId,
            Type = "Wool",
            Manufacturer = "Test Manufacturer",
            Color = "Test Color",
            NumItems = 1,
            InUse = 0
        };
        _context.YarnInventory.Add(yarn);

        var trackProject = new ProjectTracking
        {
            UserId = testUserId,
            ProjectStatus = "planned"
        };
        _context.ProjectTracking.Add(trackProject);

        _context.SaveChanges();
    }

    [Fact]
    public void DeleteUser_RemovesAllUserData()
    {
        // Set up test data and mock
        var testToken = "testToken";
        _mockTokenService.Setup(s => s.ExtractUserID(testToken))
            .Returns(TokenResult.ForSuccess(testUserId));

        // Run service and check result
        var res = _userService.DeleteUser(testToken);
        Assert.True(res.Success);

        // Check that all data has been removed
        Assert.Empty(_context.UserLogIn);
        Assert.Empty(_context.UserDetails);
        Assert.Empty(_context.UserVerification);
        Assert.Empty(_context.KnittingRecipes);
        Assert.Empty(_context.CounterInventory);
        Assert.Empty(_context.NeedleInventory);
        Assert.Empty(_context.YarnInventory);
        Assert.Empty(_context.ProjectTracking);
    }
}