﻿using Microsoft.AspNetCore.Identity;
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
    public DeleteUserResult DeleteUser(string userToken);
    public UpdateAdminResult UpdateAdmin(string userToken, Guid updatedUser, bool newAdmin);
    public BanUserResult BanUser(string userToken, Guid bannedUser, bool shouldBan);
    public GetUsersResult GetAllUsers(string userToken);
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
            var token = _tokenService.GenerateJwtToken(userLogin.UserEmail, userLogin.UserId, 
                userDetails.IsAdmin, userLogin.UserStatus);
            return UserServiceResult.ForSuccess(token, userDetails.IsAdmin, userLogin.UserStatus);
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

            var isAdmin = _context.UserDetails
                .Where(u => u.UserId == loginInfo.UserId)
                .Select(u => u.IsAdmin)
                .FirstOrDefault();

            // Generate and return token
            var token = _tokenService.GenerateJwtToken(userEmail, loginInfo.UserId, 
                isAdmin, loginInfo.UserStatus);
            return UserServiceResult.ForSuccess(token, isAdmin, loginInfo.UserStatus);
        }

        // Handle errors
        catch (DbUpdateException ex)
        {
            return UserServiceResult.ForFailure(ex.Message);
        }
    }

    public DeleteUserResult DeleteUser(string userToken)
    {
        // Extract user id from token
        var result = _tokenService.ExtractUserID(userToken);
        if(!result.Success)
        {
            return DeleteUserResult.ForFailure("Unauthorized");
        }

        var userId = result.UserId;

        using(var transaction = _context.Database.BeginTransaction()) 
        {
            try
            {
                // Get all recipes for user
                var userRecipies = _context.KnittingRecipes
                    .Where(kr => kr.UserId == userId)
                    .ToList();

                // Delete all recipes
                foreach(var recipe in userRecipies)
                {
                    if(recipe.RecipePath != null && File.Exists(recipe.RecipePath))
                    {
                        File.Delete(recipe.RecipePath);
                    }
                    _context.KnittingRecipes.Remove(recipe);
                }

                // Delete user details
                var userToDelete = _context.UserLogIn
                   .FirstOrDefault(u => u.UserId == userId);

                // Check if user exists
                if(userToDelete == null)
                {
                    throw new Exception("User not found");
                }

                _context.UserLogIn.Remove(userToDelete);
                _context.SaveChanges();

                transaction.Commit();
                return DeleteUserResult.ForSuccess();
            }
            catch(Exception ex)
            {
                // Catch any errors and rollback transaction
                transaction.Rollback();
                return DeleteUserResult.ForFailure(ex.Message);
            }
        }
    }

    public UpdateAdminResult UpdateAdmin(string userToken, Guid updatedUser, bool newAdmin)
    {
        // Extract user id from token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if(!tokenResult.Success)
        {
            return UpdateAdminResult.ForFailure("Unauthorized");
        }

        // Check if user is admin
        var userId = tokenResult.UserId;
        var isAdmin = _context.UserDetails
            .Where(u => u.UserId == userId)
            .Select(u => u.IsAdmin)
            .FirstOrDefault();

        if(!isAdmin)
        {
            return UpdateAdminResult.ForFailure("Unauthorized");
        }

        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                // Find user and update admin status
                var user = _context.UserDetails
                    .FirstOrDefault(u => u.UserId == updatedUser);

                if(user == null)
                {
                    throw new Exception("User not found");
                    //return UpdateAdminResult.ForFailure("User not found");
                }

                user.IsAdmin = newAdmin;
                _context.SaveChanges();

                transaction.Commit();
                return UpdateAdminResult.ForSuccess(updatedUser, newAdmin);
            }
            catch(Exception ex)
            {
                // Catch any errors and rollback transaction
                transaction.Rollback();
                return UpdateAdminResult.ForFailure(ex.Message);
            }
        }
    }

    public BanUserResult BanUser(string userToken, Guid bannedUser, bool shouldBan)
    {
        // Extract user id from token
        var tokenRes = _tokenService.ExtractUserID(userToken);
        if(!tokenRes.Success)
        {
            return BanUserResult.ForFailure("Unauthorized");
        }

        var userId = tokenRes.UserId;

        // Check if user is admin
        var isAdmin = _context.UserDetails
            .Where(u => u.UserId == userId)
            .Select(u => u.IsAdmin)
            .FirstOrDefault();

        if(!isAdmin)
        {
            return BanUserResult.ForFailure("Unauthorized");
        }

        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                // Find user and update status
                var user = _context.UserLogIn
                    .FirstOrDefault(u => u.UserId == bannedUser);

                if(user == null)
                {
                    return BanUserResult.ForFailure("User not found");
                }

                // Ban if true, unban if false
                if(shouldBan)
                {
                    user.UserStatus = "banned";
                    _context.SaveChanges();
                }
                else
                {
                    user.UserStatus = "verified";
                    _context.SaveChanges();
                }

                transaction.Commit();
                return BanUserResult.ForSuccess(bannedUser);
            }
            catch(Exception ex)
            {
                transaction.Rollback();
                return BanUserResult.ForFailure(ex.Message);
            }
        }
    }

    public GetUsersResult GetAllUsers(string userToken)
    {
        // Extract user id from token
        var tokenRes = _tokenService.ExtractUserID(userToken);
        if(!tokenRes.Success)
        {
            return GetUsersResult.ForFailure("Unauthorized");
        }

        var userId = tokenRes.UserId;

        // Check if user is admin
        var isAdmin = _context.UserDetails
            .Where(u => u.UserId == userId)
            .Select(u => u.IsAdmin)
            .FirstOrDefault();

        if(!isAdmin)
        {
            return GetUsersResult.ForFailure("Unauthorized");
        }

        // Get all users
        var users = _context.UserLogIn.Join(_context.UserDetails,
                                            login => login.UserId,
                                            details => details.UserId,
                                            (login, details) => new GetUsersDto
                                            {
                                                FullName = details.UserFullName,
                                                Email = login.UserEmail,
                                                Status = login.UserStatus,
                                                IsAdmin = details.IsAdmin,
                                                UserId = login.UserId
                                            }).ToList();

        return GetUsersResult.ForSuccess(users);
    }
}