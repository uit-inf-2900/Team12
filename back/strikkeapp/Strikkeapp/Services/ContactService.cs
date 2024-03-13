using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Strikkeapp.Data.Models;


//  https://mailtrap.io/blog/asp-net-core-send-email/

namespace Strikkeapp.Services; 

// tenk på H fil i C 
public interface IContactService
{
    // hva vil vi gjøre 
    // Liste inkommende greier 


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
    public async Task<Guid> CreateContactRequestAsync ()


    // List ut kontaktforespørsler


    // Svar på kontaktforespørsel + endre status til aktiv 


    // stenge kontaktforespørsel (ferdig håndtert)


}