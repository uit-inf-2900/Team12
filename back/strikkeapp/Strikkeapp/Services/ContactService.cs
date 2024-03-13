using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Strikkeapp.Data.Models;
using Strikkeapp.Data.Dto;
using Microsoft.IdentityModel.Tokens;



//  https://mailtrap.io/blog/asp-net-core-send-email/

namespace Strikkeapp.Services; 

// tenk på H fil i C 
public interface IContactService
{
    public Guid CreateContactRequest (ContactRequestDto request); 
    // hva vil vi gjøre 
    // Liste inkommende greier 
    public IEnumerable<ContactRequestDto> GetContactRequests(bool IsActive); 



    // svare på mail 


    // kunne endre status 
}

public class ContactService : IContactService
{   
    // context derfinerer tables etc  
    private readonly StrikkeappDbContext _context;

    // Dette kalles en constructor (bygger klassen)
    public ContactService(StrikkeappDbContext context)
    {
        _context = context;
    }

    // Sende inn Kontaktforespørsel 
    public Guid CreateContactRequest (ContactRequestDto request)
    {
        Console.WriteLine($"Received request: {(request)}");

        // validere inputen 
        ValidateContactRequest(request);    


        // lag den om til en entity 
        var contactRequest = CreateContactRequestEntity(request);

        // post den til databasen 
        _context.ContactRequests.Add(contactRequest);  
        _context.SaveChanges();  


        // returnere iden til den nye kontaktforespørselen
        return contactRequest.ContactRequestId; 
    }


    // List ut kontaktforespørsler
    public IEnumerable<ContactRequestDto> GetContactRequests(bool IsActive)
    {
        // hente ut alle kontaktforespørsler 
        var contactRequests = _context.ContactRequests.ToList();

        // konvertere til dto 
        var contactRequestDtos = contactRequests.Where(c => c.IsActive == IsActive).Select(c => new ContactRequestDto
        {
            UserEmail = c.Email!,
            UserName = c.FullName!,
            UserMessage = c.Message!
        });

        return contactRequestDtos; 
    }


    // Svar på kontaktforespørsel + endre status til aktiv 


    // stenge kontaktforespørsel (ferdig håndtert)

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


    private ContactRequest CreateContactRequestEntity(ContactRequestDto request)
    {
        // Setter verdiene 
        var contactRequest = new ContactRequest
        {
            FullName = request.UserName,
            Email = request.UserEmail,
            Message = request.UserMessage
        };

        return contactRequest; 
    }
}