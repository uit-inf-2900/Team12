using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;

using Strikkeapp.User.Models;
using System.Net.Mail;
using System.Net;

namespace Strikkeapp.Services;

public interface IUserService
{
    public UserServiceResult CreateUser(string userEmail, string userPwd, string userFullName, DateTime userDOB);
    public UserServiceResult LogInUser(string userEmail, string userPwd);
}

public class UserService : IUserService
{
    private readonly StrikkeappDbContext _context;
    private readonly IPasswordHasher<object> _passwordHasher;
    private readonly ITokenService _tokenService;

    private string HashPassword(string email, string password)
    {
        // Return hased password
        return _passwordHasher.HashPassword(email, password);
    }

    public UserService(StrikkeappDbContext context, 
        ITokenService tokenService, IPasswordHasher<object> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
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

            // ems
            // Send verification email
            // SendVerificationEmail(userLogin);

            // Save new entry
            _context.UserLogIn.Add(userLogin);

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
            return UserServiceResult.ForSuccess(token, userDetails.IsAdmin);
            }
        

        // Handle any errors
        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }

    private void SendVerificationEmail(UserLogIn userLogin)
    {
        var smtpClient = new SmtpClient("smtp.mailersend.net")
        {
            Port = 587,
            Credentials = new NetworkCredential("MS_N11mgG@trial-pr9084z1d8jgw63d.mlsender.net", "qp8NjvpXu7BheAWI"),
            EnableSsl = true,
        };
        // ems
        smtpClient.Send("no-reply@strikkeapp.com", userLogin.UserEmail, "Verification-Email", "Denne mailen er en test naa bare");
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

            var isAdmin = _context.UserDetails
                .Where(u => u.UserId == loginInfo.UserId)
                .Select(u => u.IsAdmin)
                .FirstOrDefault();

            // Generate and return token
            var token = _tokenService.GenerateJwtToken(userEmail, loginInfo.UserId);
            return UserServiceResult.ForSuccess(token, isAdmin);
        }

        // Handle errors
        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }


}