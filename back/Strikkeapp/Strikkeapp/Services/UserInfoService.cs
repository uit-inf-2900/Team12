using Strikkeapp.Data.Models;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IUserInfoService
{
    public UserInfoServiceResult GetProfileInfo(string jwtToken);
}

public class UserInfoService : IUserInfoService
{
    private readonly TokenService _tokenService;
    private readonly StrikkeappDbContext _context;

    public UserInfoService(TokenService tokenService, StrikkeappDbContext context)
    {
        _tokenService = tokenService;
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
}

