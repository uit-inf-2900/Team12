using MailerSend;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IVerificationService
{
    public VerificationResult CreateVerification(string userToken);
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

    public VerificationResult CreateVerification(string userToken)
    {
        var tokenRes = _tokenService.ExtractUserID(userToken);
        if(!tokenRes.Success)
        {
            return VerificationResult.ForFailure("Unauthorized");
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
                return VerificationResult.ForSuccess();
            }
            catch (Exception ex) 
            {
                return VerificationResult.ForFailure(ex.Message);
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
            .Where(uv => uv.VerificationCode == code)
            .FirstOrDefault(uid => uid.UserId == userId);

        if(userVerification == null) 
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

                transaction.Commit();
                return VerificationResult.ForSuccess();
            }
            catch (Exception ex)
            {
                return VerificationResult.ForFailure(ex.Message);
            }
        }
    }
}
