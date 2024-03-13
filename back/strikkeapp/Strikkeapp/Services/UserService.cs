using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Strikkeapp.Data.Models;

using static strikkeapp.services.UserService;

using Strikkeapp.Services;
using Strikkeapp.User.Models;

namespace strikkeapp.services;

public interface IUserService
{
    public UserServiceResult CreateUser(string userEmail, string userPwd, string userFullName, DateTime userDOB);
    public UserServiceResult LogInUser(string userEmail, string userPwd);
}

public class UserService : IUserService
{
    private readonly StrikkeappDbContext _context;
    private readonly PasswordHasher<object> _passwordHasher = new PasswordHasher<object>();
    private readonly TokenService _tokenService;

    private string HashPassword(string email, string password)
    {
        // Return hased password
        return _passwordHasher.HashPassword(email, password);
    }

    public UserService(StrikkeappDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
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
            var token = _tokenService.GenerateJwtToken(userLogin.UserEmail, userLogin.UserId);
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
            var token = _tokenService.GenerateJwtToken(userEmail, loginInfo.UserId);
            return UserServiceResult.ForSuccess(loginInfo.UserId, token);
        }

        // Handle errors
        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }


}