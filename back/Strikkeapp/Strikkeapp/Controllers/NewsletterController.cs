using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Services;

namespace Strikkeapp.Controllers;

[Route("api/newsletter")]
[ApiController]
public class NewsletterController : ControllerBase
{
    private readonly INewsletterService _newsletterService;

    public NewsletterController(INewsletterService newsletterService)
    {
        _newsletterService = newsletterService;
    }

    [HttpPost]
    [Route("addsubscriber")]
    public IActionResult AddSubscriber([FromQuery] string subEmail)
    {
        var res = _newsletterService.SubscribeToNewsletter(subEmail);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Duplicate")
            {
                return Conflict("Email is already in subscribed");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok("User subscribed to newsletter");
    }

    [HttpDelete]
    [Route("removesubscriber")]
    public IActionResult RemoveSubscriber([FromQuery] string subEmail)
    {
        var res = _newsletterService.RemoveSubscriber(subEmail);

        if(!res.Success) 
        {
            if(res.ErrorMessage == "Not found")
            {
                return NotFound("Email not found in subsciption list");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok("User has unsubscribed");
    }

    [HttpGet]
    [Route("getsunscribers")]
    public IActionResult GetSubscibers([FromQuery] string userToken)
    {
        var res = _newsletterService.GetUsers(userToken);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized("User not allowed to see subscribers");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res.Subscribers);
    }

}
