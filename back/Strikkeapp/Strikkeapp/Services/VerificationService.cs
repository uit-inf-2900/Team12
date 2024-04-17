using MailerSend;

using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IVerificationService
{
    public VerificationCreationResult CreateVerification(Guid userId);
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

    public VerificationCreationResult CreateVerification(Guid userId)
    {
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
                return VerificationCreationResult.ForSuccess();
            }
            catch (Exception ex) 
            {
                return VerificationCreationResult.ForFailure(ex.Message);
            }
        }
    }
}
