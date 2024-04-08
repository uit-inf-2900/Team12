using Microsoft.AspNetCore.Identity;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IUserInfoService
{
    public UserInfoServiceResult GetProfileInfo(string jwtToken);
    public UpdateProfileInfoResult UpdateProfileInfo(string jwtToken, string? UserFullName,
        string? UserEmail, string? OldPassword, string? NewPassword);
}

public class UserInfoService : IUserInfoService
{
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher<object> _passwordHasher;
    private readonly StrikkeappDbContext _context;

    public UserInfoService(ITokenService tokenService, IPasswordHasher<object> passwordHasher, StrikkeappDbContext context)
    {
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
        _context = context;
    }

    public UserInfoServiceResult GetProfileInfo (string jwtToken)
    {
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if (!tokenResult.Success)
        {
            return UserInfoServiceResult.ForFailure("Unauthorized");
        }

        try
        {
            var userLogIn = _context.UserLogIn
                .Where(u => u.UserId == tokenResult.UserId)
                .FirstOrDefault();

            var userDetails = _context.UserDetails
                .Where(u => u.UserId == tokenResult.UserId)
                .FirstOrDefault();

            if (userLogIn == null || userDetails == null)
            {
                return UserInfoServiceResult.ForFailure("User not found");
            }

            return UserInfoServiceResult.ForSuccess(userLogIn.UserEmail, userDetails.UserFullName);
        }

        catch (Exception ex)
        {
            return UserInfoServiceResult.ForFailure(ex.Message);
        }
    }

    public UpdateProfileInfoResult UpdateProfileInfo(string jwtToken, string? UserFullName,
        string? UserEmail, string? OldPassword, string? NewPassword)
    {
        var tokenResult = _tokenService.ExtractUserID (jwtToken);
        if (!tokenResult.Success)
        {
            return UpdateProfileInfoResult.ForFailure("Unauthorized");
        }

        if(string.IsNullOrWhiteSpace(UserFullName) && string.IsNullOrWhiteSpace(UserEmail) &&
            string.IsNullOrWhiteSpace(OldPassword) && string.IsNullOrWhiteSpace(NewPassword)) 
        {
            return UpdateProfileInfoResult.ForFailure("No fields to update");
        }


        Guid userId = tokenResult.UserId;
        List<string> updatedFields = new List<string>();

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var userDetail = _context.UserDetails
                    .FirstOrDefault(ud => ud.UserId == userId);
                var userLogIn = _context.UserLogIn
                    .FirstOrDefault(u => u.UserId == userId);

                if (userDetail == null || userLogIn == null)
                {
                    return UpdateProfileInfoResult.ForFailure("User not found");
                }

                if (!string.IsNullOrWhiteSpace(UserFullName))
                {
                    userDetail.UserFullName = UserFullName;
                    updatedFields.Add("UserFullName");
                }

                if (!string.IsNullOrWhiteSpace(UserEmail))
                {
                    userLogIn.UserEmail = UserEmail;
                    updatedFields.Add("UserEmail");

                }

                if (!string.IsNullOrWhiteSpace(OldPassword))
                {
                    if (string.IsNullOrWhiteSpace(NewPassword))
                    {
                        return UpdateProfileInfoResult.ForFailure("Password missing");
                    }

                    var res = _passwordHasher.VerifyHashedPassword(userLogIn.UserEmail, userLogIn.UserPwd, OldPassword);
                    if (res == PasswordVerificationResult.Failed)
                    {
                        return UpdateProfileInfoResult.ForFailure("Wrong password");
                    }

                    var newHashedPwd = _passwordHasher.HashPassword(userLogIn.UserEmail, NewPassword);

                    userLogIn.UserPwd = newHashedPwd;
                    updatedFields.Add("UserPassword");
                }

                _context.SaveChanges();
                transaction.Commit();
                return UpdateProfileInfoResult.ForSuccess(updatedFields);
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return UpdateProfileInfoResult.ForFailure(ex.Message);
            }
        }
    }
}

