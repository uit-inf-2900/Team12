using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using strikkeapp.services;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Services;
using System;
using Xunit;

namespace Strikkeapp.Tests
{
    public class UserServiceTests
    {
        private readonly StrikkeappDbContext _context;
        private readonly UserService _userService;
        private readonly Mock<IPasswordHasher<object>> _mockPasswordHasher = new Mock<IPasswordHasher<object>>();
        private readonly Mock<ITokenService> _mockTokenService = new Mock<ITokenService>();

        public UserServiceTests()
        {
            // Set up in memory database
            var options = new DbContextOptionsBuilder<StrikkeappDbContext>()
                .UseInMemoryDatabase(databaseName: "StrikkeappTestDb")
                .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;

            // Create new context with the options
            _context = new StrikkeappDbContext(options);

            // Set up userservice to test
            _userService = new UserService(_context, _mockTokenService.Object, _mockPasswordHasher.Object);
        }

        [Fact]
        public void CreateUser_ShouldReturnSuccess_WithValidData()
        {
            // Arrange
            var testEmail = "test@example.com";
            var testPassword = "Test123!";
            var testFullName = "Test Testing";
            var testDob = new DateTime(2024, 1, 1);
            var testId = Guid.NewGuid();

            _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<object>(), It.IsAny<string>()))
                    .Returns("hashedPassword");
            _mockTokenService.Setup(x => x.GenerateJwtToken(It.IsAny<string>(), It.IsAny<Guid>()))
                             .Returns("fakeToken");

            // Run CreateUser with test variables
            var result = _userService.CreateUser(testEmail, testPassword, testFullName, testDob);

            // Assert
            Assert.True(result.Success);
            _mockPasswordHasher.Verify(x => x.HashPassword(testEmail, testPassword), Times.Once);
            _mockTokenService.Verify(x => x.GenerateJwtToken(testEmail, It.IsAny<Guid>()), Times.Once);

            // Cleanup
            _context.Database.EnsureDeleted();
        }
    }
}
