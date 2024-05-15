using Strikkeapp.Data.Entities;
using Strikkeapp.Data.Dto;
using Microsoft.IdentityModel.Tokens;
using Strikkeapp.Data.Context;


namespace Strikkeapp.Services; 

// REMOVE COMMENT: tenk på det som en H-fil i C
public interface IContactService
{
    // Generate a contact request 
    public Guid CreateContactRequest (ContactRequestDto request); 
    // List inncomming contact requests
    public IEnumerable<ContactRequestDto> GetContactRequests(bool IsActive, bool IsHandled, string userToken); 


    // svare på mail 
    public bool ResponseMessage(Guid contactRequestId, string responseMessage);



    // kunne endre status 
    public bool UpdateIsActiveStatus(Guid contactRequestId, bool isActive, string userToken);
    public bool UpdateIsHandledStatus(Guid contactRequestId, bool isHandled, string userToken);
}

public class ContactService : IContactService
{   
    // context defines tables
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;

    // Build the service
    public ContactService(StrikkeappDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    // Send the contact request to the database
    public Guid CreateContactRequest (ContactRequestDto request)
    {
        Console.WriteLine($"Received request: {(request)}");

        // validate input
        ValidateContactRequest(request);    


        // Make it an entity
        var contactRequest = CreateContactRequestEntity(request);

        // Add it to the database and save changes
        _context.ContactRequests.Add(contactRequest);  
        _context.SaveChanges();  


        // Return the ID of the contact request
        return contactRequest.ContactRequestId; 
    }


    // Create a list of contact requests
    public IEnumerable<ContactRequestDto> GetContactRequests(bool IsActive, bool IsHandled, string userToken)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return Enumerable.Empty<ContactRequestDto>();
        }

        var isAdmin = _context.UserDetails
            .Where(u => u.UserId == tokenResult.UserId)
            .Select(u => u.IsAdmin)
            .FirstOrDefault();

        if (!isAdmin)
        {
            return Enumerable.Empty<ContactRequestDto>();
        }

        // Get alle the contact requests
        var contactRequests = _context.ContactRequests.ToList();

        // Convert to dto
        var contactRequestDtos = contactRequests
        .Where(c => c.IsActive == IsActive && c.IsHandled == IsHandled)
        .Select(c => new ContactRequestDto
        {
            ContactRequestId = c.ContactRequestId,
            UserEmail = c.Email!,
            UserName = c.FullName!,
            UserMessage = c.Message!,
            IsActive = c.IsActive, 
            IsHandled = c.IsHandled
        });

        return contactRequestDtos; 
    }


    // TODO:  Svar på kontaktforespørsel + endre status til aktiv 


    // TODO: stenge kontaktforespørsel (ferdig håndtert)


    // Validate the contact request by checking that the input is not empty or null
    private static bool ValidateContactRequest(ContactRequestDto request)
    {
        if (request.UserEmail.IsNullOrEmpty() )
        {
            throw new ArgumentException("User Email is invalid.");
        }
        if (request.UserMessage.IsNullOrEmpty() )
        {
            throw new ArgumentException("Message is invalid.");
        }
        if (request.UserName.IsNullOrEmpty() )
        {
            throw new ArgumentException("Name is invalid.");
        }

        return true; 
    }


    // Create a contact request entity from the DTO
    private ContactRequest CreateContactRequestEntity(ContactRequestDto request)
    {
        // set the values 
        var contactRequest = new ContactRequest
        {
            FullName = request.UserName,
            Email = request.UserEmail,
            Message = request.UserMessage
        };

        return contactRequest; 
    }


    // Update the status of the contact request 
    public bool UpdateIsActiveStatus(Guid contactRequestId, bool isActive, string userToken)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return false;
        }

        var isAdmin = _context.UserDetails
            .Where(u => u.UserId == tokenResult.UserId)
            .Select(u => u.IsAdmin)
            .FirstOrDefault();

        if (!isAdmin)
        {
            return false;
        }

        var contactRequest = _context.ContactRequests.Find(contactRequestId);
        if (contactRequest == null) return false;

        contactRequest.IsActive = isActive;
        _context.SaveChanges();
        return true;
    }

    public bool UpdateIsHandledStatus(Guid contactRequestId, bool isHandled, string userToken)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return false;
        }

        var isAdmin = _context.UserDetails
            .Where(u => u.UserId == tokenResult.UserId)
            .Select(u => u.IsAdmin)
            .FirstOrDefault();

        if (!isAdmin)
        {
            return false;
        }

        var contactRequest = _context.ContactRequests.Find(contactRequestId);
        if (contactRequest == null) return false;

        contactRequest.IsHandled = isHandled;
        _context.SaveChanges();
        return true;
    }

    // Answer the contact request
    public bool ResponseMessage(Guid contactRequestId, string responseMessage)
    {
        var contactRequest = _context.ContactRequests.Find(contactRequestId);
        if (contactRequest == null) return false;


        // have this '\n new message \n' to see when new message is added
        contactRequest.Message += $"\n new message \n Response: {responseMessage}";
        _context.SaveChanges();
        return true;
    }

}