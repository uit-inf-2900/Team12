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

        // Oppdater IsActive status
    [HttpPatch("{contactRequestId}/IsActive")]
    public IActionResult UpdateIsActive(Guid contactRequestId, [FromBody] bool isActive)
    {
        var result = _contactService.UpdateIsActiveStatus(contactRequestId, isActive);
        if (!result) return NotFound();
        return Ok();
    }

    // Oppdater IsHandled status
    [HttpPatch("{contactRequestId}/IsHandled")]
    public IActionResult UpdateIsHandled(Guid contactRequestId, [FromBody] bool isHandled)
    {
        var result = _contactService.UpdateIsHandledStatus(contactRequestId, isHandled);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpPost("{contactRequestId}/response")]
    public IActionResult PostResponseMessage(Guid contactRequestId, [FromBody] string responseMessage)
    {
        var result = _contactService.ResponseMessage(contactRequestId, responseMessage);
        if (!result) return NotFound("Contact request not found.");
        return Ok("Response saved successfully.");
    }

}

