using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Services; 

public interface INewsletterService
{
    public NewsletterResult SubscribeToNewsletter(string subscriberEmail);
    public NewsletterResult RemoveSubscriber(string subscriberEmail); 
    public NewsletterSubscribersResult GetUsers(string token);
}

public class NewsletterService : INewsletterService
{
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;

    public NewsletterService(StrikkeappDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public NewsletterResult SubscribeToNewsletter(string subscriberEmail)
    {
        // Check that email is not already in db
        if(_context.Newsletter.Any(se => se.email == subscriberEmail))
        {
            return NewsletterResult.ForFailure("Duplicate");
        }

        // Add email to db
        using(var transaction = _context.Database.BeginTransaction()) 
        {
            try 
            {
                var newEntry = new Newsletter
                {
                    email = subscriberEmail
                };

                _context.Newsletter.Add(newEntry);
                _context.SaveChanges();

                transaction.Commit();
                return NewsletterResult.ForSuccess();
            }
            catch (Exception ex) 
            {
                // Rollback and return errormessage if exception should occur
                transaction.Rollback();
                return NewsletterResult.ForFailure(ex.Message);
            }
        }
    }

    public NewsletterResult RemoveSubscriber(string subscriberEmail) 
    {
        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                // Get entry and check it exsits in db
                var entryForDeletion = _context.Newsletter
                    .FirstOrDefault(se => se.email == subscriberEmail);

                if(entryForDeletion == null)
                {
                    return NewsletterResult.ForFailure("Not found");
                }

                // Remove entry and save changes
                _context.Newsletter.Remove(entryForDeletion);
                _context.SaveChanges();

                transaction.Commit();
                return NewsletterResult.ForSuccess();
            }
            catch(Exception ex) 
            { 
                // Rollback and return errormessage if exception should occur
                transaction.Rollback();
                return NewsletterResult.ForFailure(ex.Message);
            }
        }
    }

    public NewsletterSubscribersResult GetUsers(string token)
    {
        // Get user token, and handle error if it cannot be retrieved
        var tokenResult = _tokenService.ExtractUserID(token);
        if(!tokenResult.Success) 
        {
            return NewsletterSubscribersResult.ForFailure("Unauthorized");
        }

        // Extract the userid
        var userId = tokenResult.UserId;

        try
        {
            // Check that the requesting user is an admin
            var user = _context.UserDetails
                .FirstOrDefault(ud => ud.UserId == userId);

            if(user == null || user.IsAdmin != true)
            {
                return NewsletterSubscribersResult.ForFailure("Unauthorized");
            }

            // Get list of subscribers and return it
            var subscribers = _context.Newsletter
                .Select(e => e.email)
                .ToList();


            return NewsletterSubscribersResult.ForSuccess(subscribers);
        }

        catch(Exception ex)
        {
            // Return error message if exception should occur
            return NewsletterSubscribersResult.ForFailure(ex.Message);
        }
    }
}