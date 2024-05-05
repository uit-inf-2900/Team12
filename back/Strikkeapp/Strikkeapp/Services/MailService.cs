using MailerSend;
using MailerSend.AspNetCore;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IMailService
{
    public MailResult SendVerification(string userToken);
}

public class MailService : IMailService
{ 
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IVerificationService _verificationService;
    private readonly MailerSendService _mailersend;


    public MailService(StrikkeappDbContext context, ITokenService tokenService, 
        IVerificationService verificationService, MailerSendService mailerSend)
    {
        _context = context;
        _tokenService = tokenService;
        _verificationService = verificationService;
        _mailersend = mailerSend;
    }


    public MailResult SendVerification(string userToken)
    {
        var tokenRes = _tokenService.ExtractUserID(userToken);
        if (!tokenRes.Success) 
        {
            return MailResult.ForFailure("Unauthorized");
        }

        var userId = tokenRes.UserId;

        var user = _context.UserLogIn
            .FirstOrDefault(u => u.UserId == userId);

        if (user == null) 
        {
            return MailResult.ForFailure("Not found");
        }

        var verificationRes = _verificationService.CreateVerification(userToken);

        var to = new List<Recipient>()
        {
            new Recipient()
            {
                Email = user.UserEmail,
                Substitutions = new Dictionary<string, string>()
                {
                    {"Verificationcode", $"{verificationRes.Code}" }
                }
            }
        };

        string emailText = "Confirm your email for your KnitHub account.\n" +
            "To help us make sure it's really you, here's the verification code you'll need to verify your account.\n\n" +
            $"Verification code: {verificationRes.Code}" +
            "\n\n Best regards, the KnitHub team";

        try
        {
            _mailersend.SendMailAsync(
                to, subject: "Verification code", text: emailText);
        }
        catch (Exception ex) 
        { 
            return MailResult.ForFailure(ex.Message);
        }

        return MailResult.ForSuccess();
    }
}
