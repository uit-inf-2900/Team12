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
        public string? UserEmail { get; set; } = string.Empty;
        public string? UserPwd { get; set; } = string.Empty;
        public string? UserFullName { get; set; } = string.Empty;
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



    [HttpPost]
    [Route("/createuser")]
    public IActionResult CreateUser([FromBody] CreateUserRequest request)
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
}