using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Data.Dto;
using Strikkeapp.Services;


namespace strikkeapp.Controllers; 

[ApiController]
[Route("api/[controller]")]

public class ContactController : ControllerBase 
{
    private readonly IContactService _contactService;
    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    // create the endpoints 

    // Post a contact request
    [HttpPost]
    
    public IActionResult PostContactRequest([FromBody] ContactRequestDto contactRequest)
    {
        return Ok(_contactService.CreateContactRequest(contactRequest));
    }

    // Get all contact requests
    // TODO: legg til at kun admin kan se alle, ingen andre 
    [HttpGet]
    public IActionResult GetContactRequests([FromQuery] bool isActive)
    {
        return Ok(_contactService.GetContactRequests(isActive));
    }
}

