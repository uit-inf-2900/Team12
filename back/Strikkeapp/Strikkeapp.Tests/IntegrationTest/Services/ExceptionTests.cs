using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using Moq.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Services;
using Strikkeapp.Models;

namespace Strikkeapp.Tests;

public class ExceptionTests
{
    // Mock database
    private readonly Mock<StrikkeappDbContext> _mockContext;
    
    // Create mock services
    private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
    private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

    // Services to test
    private readonly UserService _userService;


    public ExceptionTests()
    {
        // Set up mock password hasher
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                .Returns("hashedPassword");

        _mockTokenService.Setup(x => x.ExtractUserID(It.IsAny<string>()))
            .Returns(TokenResult.ForSuccess(Guid.NewGuid()));

        // Set up mock database
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _mockContext = new Mock<StrikkeappDbContext>(options, _mockPasswordHasher.Object);

        // Set up mock database sets
        var mockUserLogIn = new Mock<DbSet<UserLogIn>>();
        _mockContext.Setup(c => c.UserLogIn).ReturnsDbSet(new List<UserLogIn>());
        var mockUserDetails = new Mock<DbSet<UserDetails>>();
        _mockContext.Setup(c => c.UserDetails).ReturnsDbSet(new List<UserDetails>());
        var mockTransaction = new Mock<IDbContextTransaction>();
        _mockContext.Setup(c => c.Database.BeginTransaction()).Returns(mockTransaction.Object);

        // Save changes throws exception
        _mockContext.Setup(m => m.SaveChanges())
            .Throws(new DbUpdateException("Simulated Exception", new DbUpdateException()));

        //Set up services
        _userService = new UserService(_mockContext.Object, _mockTokenService.Object, _mockPasswordHasher.Object);
    }

    [Fact]
    public void UserServices_ThrowsException()
    {
        // Creating user throws exception
        var create = _userService.CreateUser("fake@email.com", "fakePwd", "Fake Name", DateTime.Now);
        Assert.False(create.Success);

        // Logging in throws exception
        var login = _userService.LogInUser("test@example.com", "Test1234!");
        Assert.False(login.Success);

        // Deleting user throws exception
        var delete = _userService.DeleteUser("fakeToken");
        Assert.False(delete.Success);

        // Updating admin throws exception
        var update = _userService.UpdateAdmin("fakeToken", Guid.NewGuid(), true);
        Assert.False(update.Success);

        // Banning user throws exception
        var ban = _userService.BanUser("fakeToken", Guid.NewGuid(), true);
        Assert.False(ban.Success);
    }
    
}