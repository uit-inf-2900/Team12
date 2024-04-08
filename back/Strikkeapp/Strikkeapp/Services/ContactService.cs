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
    public IEnumerable<ContactRequestDto> GetContactRequests(bool IsActive); 


    // svare på mail 
    public bool ResponseMessage(Guid contactRequestId, string responseMessage);



    // kunne endre status 
    bool UpdateIsActiveStatus(Guid contactRequestId, bool isActive);
    bool UpdateIsHandledStatus(Guid contactRequestId, bool isHandled);
}

public class ContactService : IContactService
{   
    // context defines tables
    private readonly StrikkeappDbContext _context;

    // Build the service
    public ContactService(StrikkeappDbContext context)
    {
        _context = context;
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
    public IEnumerable<ContactRequestDto> GetContactRequests(bool IsActive)
    {
        // Get alle the contact requests
        var contactRequests = _context.ContactRequests.ToList();

        // Convert to dto
        var contactRequestDtos = contactRequests.Where(c => c.IsActive == IsActive).Select(c => new ContactRequestDto
        {
            UserEmail = c.Email!,
            UserName = c.FullName!,
            UserMessage = c.Message!
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
    public bool UpdateIsActiveStatus(Guid contactRequestId, bool isActive)
    {
        var contactRequest = _context.ContactRequests.Find(contactRequestId);
        if (contactRequest == null) return false;

        contactRequest.IsActive = isActive;
        _context.SaveChanges();
        return true;
    }

    public bool UpdateIsHandledStatus(Guid contactRequestId, bool isHandled)
    {
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

        contactRequest.ResponseMessage = responseMessage;
        _context.SaveChanges();
        return true;
    }

}