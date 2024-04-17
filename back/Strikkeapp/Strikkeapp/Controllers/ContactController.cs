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
    // If empty, return ok with a message 
    [HttpGet]
    public IActionResult GetContactRequests([FromQuery] bool isActive)
    {
        var contactRequests = _contactService.GetContactRequests(isActive);
        if (contactRequests == null || !contactRequests.Any())
        {
            // Instead of returning NotFound, return Ok with a specific message indicating the list is empty.
            // This is a better practice because the client can still expect a response from the server, since a emty list in this case not is an error. 
            return Ok(new { Message = "No contact requests found." });
        }
        return Ok(_contactService.GetContactRequests(isActive));
    }

        // Oppdater IsActive status
    [HttpPatch("{contactRequestId}/IsActive")]
    public IActionResult UpdateIsActive(Guid contactRequestId, [FromBody] bool isActive)
    {
        var result = _contactService.UpdateIsActiveStatus(contactRequestId, isActive);
        if (!result) return NotFound();
        return Ok(new 
        {
            isActive = result,
            requestId = contactRequestId
        });
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

