using Microsoft.AspNetCore.Mvc;
using strikkeapp.services;

using Strikkeapp.Models;

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

        var res = new UserResultDto
        {
            Token = result.Token,
            IsAdmin = result.IsAdmin
        };


        // Return userid and token on success
        return Ok(res);
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

        var res = new UserResultDto
        {
            Token = result.Token,
            IsAdmin = result.IsAdmin
        };

        // Return userid and token on success
        return Ok(res);
    }
}