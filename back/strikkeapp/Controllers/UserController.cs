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
        public string? UserFullName { get; set; }
        public int UserDOB { get; set; }
        public string? UserGender { get; set; }

        // Check that request is valid
        public bool requestOK()
        {
            return (!string.IsNullOrWhiteSpace(UserEmail) &&
           !string.IsNullOrWhiteSpace(UserPwd) &&
           !string.IsNullOrWhiteSpace(UserFullName) &&
           !string.IsNullOrWhiteSpace(UserGender));
        }
    }
 


    [HttpPost]
    [Route("/createuser")]
    public IActionResult CreateUser([FromQuery] CreateUserRequest request)
    {
        if (!request.requestOK())
        {
            return BadRequest();
        }

        var result = _userService.CreateUser(request.UserEmail, request.UserPwd, request.UserFullName, request.UserDOB, request.UserGender);
        if(result == -1)
        {
            return BadRequest("Unable to proccess user");
            //return StatusCode(500, "Unable to proccess user");
        }

        //return Created(result);
        return Ok(result);
    }
}