using Moq;
using Microsoft.Extensions.Configuration;

using Strikkeapp.Services;

namespace Strikkeapp.Tests;

public class TokenServiceTests
{
    private TokenService _tokenService;

    public TokenServiceTests()
    {
        var config = new Mock<IConfiguration>();
        config.SetupGet(x => x["Jwt:Key"]).Returns("0123456789ABCDEF0123456789ABCDEF");
        config.SetupGet(x => x["Jwt:Issuer"]).Returns("YourIssuer");
        config.SetupGet(x => x["Jwt:Audience"]).Returns("YourAudience");

        _tokenService = new TokenService(config.Object);
    }

    [Fact]
    public void Valid_Token_Returned()
    {
        string testEmail = "test@example.com";
        Guid testGuid = Guid.NewGuid();
        bool testAdmin = false;
        string testStatus = "unverified";

        string token = _tokenService.GenerateJwtToken(testEmail, testGuid, testAdmin, testStatus);

        Assert.NotNull(token);
        Assert.NotEmpty(token);
    }

    [Fact]
    public void UserID_Success_ValidToken()
    {
        string testEmail = "test@example.com";
        Guid testGuid = Guid.NewGuid();
        bool testAdmin = false;
        string testStatus = "unverified";

        string token = _tokenService.GenerateJwtToken(testEmail, testGuid, testAdmin, testStatus);

        var res = _tokenService.ExtractUserID(token);

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
}