using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Strikkeapp.Data.Models;
using static strikkeapp.services.UserService;

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

    private string HashPassword(string password)
    {
        // Return hased password
        return _passwordHasher.HashPassword(null!, password);
    }

    public UserService(StrikkeappDbContext context)
    {
        _context = context;
    }

    public class UserServiceResult
    {
        public bool Success { get; set; }
        public int UserId { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;

        public static UserServiceResult ForSuccess(int userId) => new UserServiceResult { Success = true, UserId = userId };
        public static UserServiceResult ForFailure(string message) => new UserServiceResult { Success = false, ErrorMessage = message };
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
            var hasedPwd = HashPassword(userPwd);
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
        catch(DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }

    public UserServiceResult LogInUser(string userEmail, string userPwd)
    {
        return null;
    }
}

// EKSEMPEL PÅ QUERY TIL DATABASE
// var test = _context.UserLogIn.Where(x => x.UserStatus == "verified").Select(x => x.UserId);