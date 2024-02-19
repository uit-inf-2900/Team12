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

        public DateTime Dob2Dt ()
        {
            int year = UserDOB / 10000;
            int month = (UserDOB / 100) % 100;
            int day = UserDOB % 100;

            DateTime dob = new DateTime(year, month, day);
            return dob;
        }
    }

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
    public IActionResult CreateUser([FromQuery] CreateUserRequest request)
    {
        if (!request.requestOK())
        {
            return BadRequest();
        }

        var result = _userService.CreateUser(request.UserEmail, request.UserPwd, request.UserFullName, request.Dob2Dt());
        
        if(!result.Success)
        {
            if(result.ErrorMessage == "Email already exsits")
            {
                return Conflict(result.ErrorMessage);
            }

            return BadRequest(result.ErrorMessage);
        }

        return Ok(result.UserId);
    }

    [HttpPost]
    [Route("/login")]
    public IActionResult LogInUser([FromQuery] LogInUserRequest request)
    {

        var result = _userService.LogInUser(request.UserEmail, request.UserPwd);
        if (!result.Success)
        {
            if (result.ErrorMessage == "Invalid login attempt")
            {
                return Unauthorized(result.ErrorMessage);
            }

            return StatusCode(500, result.ErrorMessage);
        }


        return Ok(new {
            UserID = result.UserId,
             Token = result.Token});
    }
}