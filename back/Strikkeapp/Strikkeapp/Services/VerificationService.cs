using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IVerificationService
{
    public VerificationResultCreate CreateVerification(string userToken);
    public VerificationResult VerifyCode(string userToken, string code);
}

public class VerificationService : IVerificationService
{
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;

    public VerificationService(StrikkeappDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public VerificationResultCreate CreateVerification(string userToken)
    {
        var tokenRes = _tokenService.ExtractUserID(userToken);
        if(!tokenRes.Success)
        {
            return VerificationResultCreate.ForFailure("Unauthorized");
        }

        var userId = tokenRes.UserId;


        using(var transaction =  _context.Database.BeginTransaction()) 
        {
            try 
            {
                var newVerification = new UserVerification
                {
                    UserId = userId,
                };

                _context.UserVerification.Add(newVerification);
                _context.SaveChanges();


                transaction.Commit();
                return VerificationResultCreate.ForSuccess(newVerification.VerificationCode);
            }
            catch (Exception ex) 
            {
                return VerificationResultCreate.ForFailure(ex.Message);
            }
        }
    }

    public VerificationResult VerifyCode(string userToken, string code)
    {
        var tokenRes = _tokenService.ExtractUserID(userToken);

        if(!tokenRes.Success) 
        {
            return VerificationResult.ForFailure("Unauthorized");
        }

        var userId = tokenRes.UserId;

        var userVerification = _context.UserVerification
            .FirstOrDefault(uv => uv.VerificationCode == code && uv.UserId == userId);

        if (userVerification == null) 
        {
            return VerificationResult.ForFailure("Not found");
        }

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var user = _context.UserLogIn
                    .FirstOrDefault(u => u.UserId == userId);

                if(user == null) 
                {
                    return VerificationResult.ForFailure("Not found");
                }

                user.UserStatus = "verified";
                _context.SaveChanges();

                _context.UserVerification.Remove(userVerification);
                _context.SaveChanges();

                transaction.Commit();

                var userLogin = _context.UserLogIn
                    .FirstOrDefault(u => u.UserId == userId);
                var userDetails = _context.UserDetails
                    .FirstOrDefault(u => u.UserId == userId);
                
                if(userLogin == null || userDetails == null) 
                {
                    throw new Exception("User not found");
                }
                // Generate and return token
                var token = _tokenService.GenerateJwtToken(userLogin.UserEmail, userLogin.UserId, 
                    userDetails.IsAdmin, userLogin.UserStatus);

                return VerificationResult.ForSuccess(token);
            }
            catch (Exception ex)
            {
                return VerificationResult.ForFailure(ex.Message);
            }
        }
    }
}
