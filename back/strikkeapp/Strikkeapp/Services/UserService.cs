using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

using Strikkeapp.Data.Models;


using static strikkeapp.services.UserService;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace strikkeapp.services;

public interface IUserService
{
    public UserServiceResult CreateUser(string userEmail, string userPwd, string userFullName, DateTime userDOB);
    public UserServiceResult LogInUser(string userEmail, string userPwd);
    public string GenerateJwtToken(string userEmail, int userID);
}

public class UserService : IUserService
{
    private readonly StrikkeappDbContext _context;
    private readonly PasswordHasher<object> _passwordHasher = new PasswordHasher<object>();
    private readonly IConfiguration _configuration;

    private string HashPassword(string email, string password)
    {
        // Return hased password
        return _passwordHasher.HashPassword(email, password);
    }

    public UserService(StrikkeappDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public class UserServiceResult
    {
        public bool Success { get; set; }
        public int UserId { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;

        public static UserServiceResult ForSuccess(int userId) => new UserServiceResult { 
            Success = true, 
            UserId = userId };
        public static UserServiceResult ForSuccessToken(int userId, string token) => new UserServiceResult { 
            Success = true,
            UserId = userId,
            Token = token };
        public static UserServiceResult ForFailure(string message) => new UserServiceResult {
            Success = false, 
            ErrorMessage = message };

    }

    public UserServiceResult CreateUser(string userEmail, string userPwd, string userFullName, DateTime userDOB)
    {
        try
        {
            if (_context.UserLogIn.Any(x => x.UserEmail == userEmail))
            {
                return UserServiceResult.ForFailure("Email already exsits");
            }

            var userLogin = new UserLogIn();
            userLogin.UserEmail = userEmail;
            var hasedPwd = HashPassword(userEmail, userPwd);
            userLogin.UserPwd = hasedPwd;

            _context.UserLogIn.Add(userLogin);
            _context.SaveChanges();

            var userDetails = new UserDetails();
            userDetails.UserId = userLogin.UserId;
            userDetails.UserFullName = userFullName;
            userDetails.DateOfBirth = userDOB;

            _context.UserDetails.Add(userDetails);
            _context.SaveChanges();

            return UserServiceResult.ForSuccess(userLogin.UserId);
        }

        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }

    public UserServiceResult LogInUser(string userEmail, string userPwd)
    {
        try
        {
            var loginInfo = _context.UserLogIn
                .Where(x => x.UserEmail == userEmail)
                .Select(x => new { x.UserPwd, x.UserId })
                .FirstOrDefault();

            if (loginInfo == null)
            {
                return UserServiceResult.ForFailure("Invalid login attempt");
            }


            var res = _passwordHasher.VerifyHashedPassword(userEmail, loginInfo.UserPwd, userPwd);

            if (res == PasswordVerificationResult.Failed)
            {
                return UserServiceResult.ForFailure("Invalid login attempt");
            }

            var token = GenerateJwtToken(userEmail, loginInfo.UserId);
            return UserServiceResult.ForSuccessToken(loginInfo.UserId, token);
        }

        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }

    public string GenerateJwtToken(string userEmail, int userID)
    {
        var keyString = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(keyString))
        {
            throw new InvalidOperationException("JWT Key is not configured properly.");
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(keyString); // Ensure _configuration is accessible
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Email, userEmail),
            new Claim("userId", userID.ToString())
        }),
            Expires = DateTime.UtcNow.AddDays(7), // Token expiration
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}