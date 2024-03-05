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
    public string GenerateJwtToken(string userEmail, Guid userID);
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

    // Schema for query result
    public class UserServiceResult
    {
        public bool Success { get; set; }
        public Guid UserId { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;

        public static UserServiceResult ForSuccess(Guid userId, string token) => new UserServiceResult { 
            Success = true,
            UserId = userId,
            Token = token };
        public static UserServiceResult ForFailure(string message) => new UserServiceResult {
            Success = false, 
            ErrorMessage = message };

    }

    // Add new user to database
    public UserServiceResult CreateUser(string userEmail, string userPwd, string userFullName, DateTime userDOB)
    {
        try
        {
            // Check if email already exsits in database
            if (_context.UserLogIn.Any(x => x.UserEmail == userEmail))
            {
                return UserServiceResult.ForFailure("Email already exsits");
            }

            // Add to userLogin
            var userLogin = new UserLogIn();
            userLogin.UserEmail = userEmail;
            var hasedPwd = HashPassword(userEmail, userPwd);
            userLogin.UserPwd = hasedPwd;

            // Save new entry
            _context.UserLogIn.Add(userLogin);
            _context.SaveChanges();

            // Add to userDetails
            var userDetails = new UserDetails();
            userDetails.UserId = userLogin.UserId;
            userDetails.UserFullName = userFullName;
            userDetails.DateOfBirth = userDOB;

            // Save new entry
            _context.UserDetails.Add(userDetails);
            _context.SaveChanges();

            // Generate and return token
            var token = GenerateJwtToken(userLogin.UserEmail, userLogin.UserId);
            return UserServiceResult.ForSuccess(userLogin.UserId, token);
        }

        // Handle any errors
        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }

    // Log existing user in
    public UserServiceResult LogInUser(string userEmail, string userPwd)
    {
        try
        {
            // Get user info from database
            var loginInfo = _context.UserLogIn
                .Where(x => x.UserEmail == userEmail)
                .Select(x => new {
                    x.UserPwd, 
                    x.UserId,  
                    x.UserStatus})
                .FirstOrDefault();

            // If user does not exsist
            if (loginInfo == null)
            {
                return UserServiceResult.ForFailure("Invalid login attempt");
            }

            // If user is banned
            if(loginInfo.UserStatus == "banned")
            {
                return UserServiceResult.ForFailure("User is banned");
            }

            // Unhash password
            var res = _passwordHasher.VerifyHashedPassword(userEmail, loginInfo.UserPwd, userPwd);

            // Check if password matches
            if (res == PasswordVerificationResult.Failed)
            {
                return UserServiceResult.ForFailure("Invalid login attempt");
            }

            // Generate and return token
            var token = GenerateJwtToken(userEmail, loginInfo.UserId);
            return UserServiceResult.ForSuccess(loginInfo.UserId, token);
        }

        // Handle errors
        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }

    // Generate token for satying logged in
    public string GenerateJwtToken(string userEmail, Guid userID)
    {
        // Recieve token key from app config and verify
        var keyString = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(keyString))
        {
            throw new InvalidOperationException("JWT Key is not configured properly.");
        }

        // Generate new handler to generate token
        var tokenHandler = new JwtSecurityTokenHandler();
        // Convert key to bytes
        var key = Encoding.ASCII.GetBytes(keyString);
        // Add token descriptor with user info
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Email, userEmail),
            new Claim("userId", userID.ToString())
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
}