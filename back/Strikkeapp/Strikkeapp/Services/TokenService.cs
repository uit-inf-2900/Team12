using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Strikkeapp.Models;

namespace Strikkeapp.Services;


public interface ITokenService
{
    public string GenerateJwtToken(string userEmail, Guid userID, bool isAdmin, string userStatus);
    public TokenResult ExtractUserID(string token);
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly string _keyString;
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        _keyString = _configuration["Jwt:Key"]!;

        if (string.IsNullOrWhiteSpace(_keyString))
        {
            throw new InvalidOperationException("JWT Key is not configured properly.");
        }
    }

    // Generate token for satying logged in
    public string GenerateJwtToken(string userEmail, Guid userID, bool isAdmin, string userStatus)
    {
        // Generate new handler to generate token
        var tokenHandler = new JwtSecurityTokenHandler();
        // Convert key to bytes
        var key = Encoding.ASCII.GetBytes(_keyString);
        // Add token descriptor with user info
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Email, userEmail),
            new Claim("userId", userID.ToString()),
            new Claim("isAdmin", isAdmin.ToString()),
            new Claim("userStatus", userStatus)

        }),
            // Set expiration date
            Expires = DateTime.UtcNow.AddDays(7),
            // Set sign in credentials
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            // Add issuer and audience from config
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        // Create and return the token as a string
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public TokenResult ExtractUserID(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_keyString));
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateLifetime = true,
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userIdClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "userId");

            if(!(userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId)))
            {
                return TokenResult.ForFailure("Token not found");
            }

            return TokenResult.ForSuccess(userId);
        }

        catch(SecurityTokenException ex)
        {
            return TokenResult.ForFailure($"Token validation failed: {ex.Message}");
        }
        catch(Exception ex)
        {
            return TokenResult.ForFailure($"Error while processing token: {ex.Message}");
        }
    }
}

