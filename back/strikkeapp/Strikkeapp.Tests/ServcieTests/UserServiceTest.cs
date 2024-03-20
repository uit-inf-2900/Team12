using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;

using Strikkeapp.Services;
using strikkeapp.services;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;


namespace Strikkeapp.Tests.ServcieTests;

public class UserServiceTest
{
    private readonly UserService _userService;
    private readonly Mock<StrikkeappDbContext> _mockContext;
    private readonly Mock<IPasswordHasher<object>> _mockHasher;
    private readonly Mock<TokenService> _mockTokenService;

    public UserServiceTest()
    {
        // Create mock services
        _mockContext = new Mock<StrikkeappDbContext>(new DbContextOptions<StrikkeappDbContext>());
        _mockHasher = new Mock<IPasswordHasher<object>>();
        _mockTokenService = new Mock<TokenService>();

        // Initialize userservice with mocks
        _userService = new UserService(_mockContext.Object, _mockTokenService.Object, _mockHasher.Object);
    }

    [Fact]
    public void CreateUserOk()
    {
        var userEmail = "test@example.com";
        var userPwd = "Test123!";
        var userFullName = "Test Testing";
        var userDOB = new DateTime(2024, 1, 1);
        var fakeUserId = Guid.NewGuid();

        var hashedPwd = "hashed_password";
        var expectedToken = "token";

        var userLogInMock = new Mock<DbSet<UserLogIn>>();
        var userDetailsMock = new Mock<DbSet<UserDetails>>();
        _mockContext.Setup(m => m.UserLogIn).Returns(() => userLogInMock.Object);
        _mockContext.Setup(m => m.UserDetails).Returns(() => userDetailsMock.Object);

        _mockContext.Setup(m => m.UserLogIn.Any(x => x.UserEmail == userEmail)).Returns(false);
        _mockHasher.Setup(m => m.HashPassword(It.IsAny<object>(), userPwd)).Returns(hashedPwd);
        _mockTokenService.Setup(m => m.GenerateJwtToken(userEmail, fakeUserId)).Returns(expectedToken);

        _mockContext.Setup(m => m.SaveChanges()).Verifiable();

        var result = _userService.CreateUser(userEmail, userPwd, userFullName, userDOB);

        Assert.True(result.Success);
        Assert.Equal(expectedToken, result.Token);
        
        userLogInMock.Verify(m => m.Add(It.IsAny<UserLogIn>()), Times.Once());
        userDetailsMock.Verify(m => m.Add(It.IsAny<UserDetails>()), Times.Once());
        _mockContext.Verify(m => m.SaveChanges(), Times.Exactly(2));
    }

}
