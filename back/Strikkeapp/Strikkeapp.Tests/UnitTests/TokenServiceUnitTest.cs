using Moq;
using Microsoft.Extensions.Configuration;

using Strikkeapp.Services;

namespace Strikkeapp.Tests;

public class TokenServiceTests
{
    private TokenService _tokenService;

    public TokenServiceTests()
    {
        // Set up configuration
        var config = new Mock<IConfiguration>();
        config.SetupGet(x => x["Jwt:Key"]).Returns("0123456789ABCDEF0123456789ABCDEF");
        config.SetupGet(x => x["Jwt:Issuer"]).Returns("YourIssuer");
        config.SetupGet(x => x["Jwt:Audience"]).Returns("YourAudience");

        _tokenService = new TokenService(config.Object);
    }

    [Fact]
    public void Valid_Token_Returned()
    {
        // Set up test data
        string testEmail = "test@example.com";
        Guid testGuid = Guid.NewGuid();
        bool testAdmin = false;
        string testStatus = "unverified";

        // Generate token and ensure it is not null or empty
        string token = _tokenService.GenerateJwtToken(testEmail, testGuid, testAdmin, testStatus);

        Assert.NotNull(token);
        Assert.NotEmpty(token);
    }

    [Fact]
    public void UserID_Success_ValidToken()
    {
        // Set up test data
        string testEmail = "test@example.com";
        Guid testGuid = Guid.NewGuid();
        bool testAdmin = false;
        string testStatus = "unverified";

        // Generate token
        string token = _tokenService.GenerateJwtToken(testEmail, testGuid, testAdmin, testStatus);

        // Extract user ID from token
        var res = _tokenService.ExtractUserID(token);

        // Assert if fail or mismatch
        Assert.True(res.Success);
        Assert.Equal(res.UserId, testGuid);
    }

    [Fact]
    public void UserID_Fails_InvalidToken()
    {
        string invalidToken = "FakeToken";

        var res = _tokenService.ExtractUserID(invalidToken);

        Assert.False(res.Success);
    }

    [Fact]
    public void InvalidKey_Fails()
    {
        // Setup configuration with empty key
        var config = new Mock<IConfiguration>();
        config.SetupGet(x => x["Jwt:Key"]).Returns("");
        config.SetupGet(x => x["Jwt:Issuer"]).Returns("YourIssuer");
        config.SetupGet(x => x["Jwt:Audience"]).Returns("YourAudience");

        // Run serivce and expect exception
        TokenService tokenService = null!;
        Assert.Throws<InvalidOperationException>(() => tokenService = new TokenService(config.Object));
    }

    [Fact]
    public void InvalidToken_Fails()
    {
        // Set up and run serivce
        var invalidToken = "invalidToken";
        var result = _tokenService.ExtractUserID(invalidToken);

        // Assert if sucess and ensure correct error
        Assert.False(result.Success);
        Assert.True(result.ErrorMessage.Contains("Token not found") || result.ErrorMessage.Contains("Error while processing token"));
    }
}