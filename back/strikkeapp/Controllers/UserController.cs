using Microsoft.AspNetCore.Mvc;
using strikkeapp.services;

namespace strikkeapp.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    public class CreateUserRequest
    {
        public string? UserEmail { get; set; }
        public string? UserPwd { get; set; }
    }

    [HttpGet]
    [Route("/test")]
    public bool Test()
    {
        return _userService.Test();
    }


    //[HttpGet(Route = "/login")]
    //public

    [HttpPost]
    [Route("/createuser")]
    public IActionResult CreateUser([FromQuery] CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserEmail) || string.IsNullOrWhiteSpace(request.UserPwd))
        {
            return BadRequest("Missing email or password.");
        }

        var result = _userService.CreateUser(request.UserEmail, request.UserPwd);
        if(result == -1)
        {
            return StatusCode(500, "Unable to proccess user");
        }

        return Ok(result);
    }
}