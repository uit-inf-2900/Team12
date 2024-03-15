using Microsoft.AspNetCore.Mvc;
using strikkeapp.services;

namespace strikkeapp.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    // Set user service
    private readonly IUserService _userService;
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // Create user request schema
    public class CreateUserRequest
    {
        public string UserEmail { get; set; } = string.Empty;
        public string UserPwd { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public int UserDOB { get; set; }

        // Check that request is valid
        public bool requestOK()
        {
            return (!string.IsNullOrWhiteSpace(UserEmail) &&
           !string.IsNullOrWhiteSpace(UserPwd) &&
           !string.IsNullOrWhiteSpace(UserFullName));
        }

        // Calculate birth day
        public DateTime Dob2Dt ()
        {
            int year = UserDOB / 10000;
            int month = (UserDOB / 100) % 100;
            int day = UserDOB % 100;

            DateTime dob = new DateTime(year, month, day);
            return dob;
        }
    }

    // Login request schema
    public class LogInUserRequest
    {
        public string UserEmail { get; set; } = string.Empty;
        public string UserPwd { get; set; } = string.Empty;

        public bool requestOk()
        {
            return (!string.IsNullOrWhiteSpace(UserEmail) &&
                !string.IsNullOrWhiteSpace(UserPwd));
        }
    }



    [HttpPost]
    [Route("/createuser")]
    public IActionResult CreateUser([FromBody] CreateUserRequest request)
    {
        // Check request
        if (!request.requestOK())
        {
            return BadRequest();
        }

        // Call service
        var result = _userService.CreateUser(request.UserEmail, request.UserPwd, request.UserFullName, request.Dob2Dt());
        
        // Check if service succeeded
        if(!result.Success)
        {
            // Send conflict if email already exsits
            if(result.ErrorMessage == "Email already exsits")
            {
                return Conflict(result.ErrorMessage);
            }

            return BadRequest(result.ErrorMessage);
        }

        // Return userid and token on success
        return Ok(new
        {
            Token = result.Token,
            IsAdmin = result.IsAdmin
        });
    }

    [HttpPost]
    [Route("/login")]
    public IActionResult LogInUser([FromBody] LogInUserRequest request)
    {
        // Call service
        var result = _userService.LogInUser(request.UserEmail, request.UserPwd);
        // Check for success
        if (!result.Success)
        {
            // Unauthorized if invalid atempt or user is banned
            if (result.ErrorMessage == "Invalid login attempt" ||
                result.ErrorMessage == "User is banned")
            {
                return Unauthorized(result.ErrorMessage);
            }

            // Something else is wrong
            return StatusCode(500, result.ErrorMessage);
        }

        // Return userid and token on success
        return Ok(new 
        {
             Token = result.Token,
             IsAdmin = result.IsAdmin
        });
    }
}