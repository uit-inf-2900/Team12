using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Data.Context;
using Strikkeapp.Services;
using System.Linq;

using Strikkeapp.Models;

namespace strikkeapp.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    // Set user service
    private readonly IUserService _userService;
    private readonly IMailService _mailService;
    private readonly StrikkeappDbContext _context; // Legg til referanse til DbContext her

    public UsersController(IUserService userService, StrikkeappDbContext context, IMailService mailService)
    {
        _userService = userService;
        _context = context;
        _mailService = mailService;
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

        var mailRes = _mailService.SendVerification(result.Token);
        /*
        if(!mailRes.Succes)
        {
            if(mailRes.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }

            if(mailRes.ErrorMessage == "Not found")
            {
                return NotFound("Cannot find user or code");
            }

            return StatusCode(500, "Cannot process request");
        }*/

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

    [HttpDelete]
    [Route("deleteuser")]
    public IActionResult DeleteUser(string userToken)
    {
        var res = _userService.DeleteUser(userToken);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized("Invalid token");
            }

            if(res.ErrorMessage == "Not found")
            {
                return StatusCode(500, "Unable to find user");
            }

            return StatusCode(500, "Unable to delete user");
        }

        return Ok();
    }

    [HttpPatch]
    [Route("updateadmin")]
    public IActionResult UpdateAdmin(UpdateAdminRequest request)
    {
        if(!request.requestOk())
        {
            return BadRequest();
        }

        var res = _userService.UpdateAdmin(request.UserToken, request.UpdateUser, request.NewAdmin);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }
            if(res.ErrorMessage == "User not found")
            {
                return NotFound(res.ErrorMessage);
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res);
    }

    [HttpPatch]
    [Route("banuser")]
    public IActionResult BanUser(BanUserRequest request)
    {
        if(!request.requestOk())
        {
            return BadRequest();
        }

        var res = _userService.BanUser(request.UserToken, request.BanUserId, request.Ban);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }

            if(res.ErrorMessage == "User not found")
            {
                return NotFound("Could not find user to ban");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res.BannedUser);
    }


    [HttpGet]
    [Route("/getUsers")]
    public IActionResult GetAllUsers()
    {
        var users = _context.UserLogIn.Join(_context.UserDetails,
                                            login => login.UserId,
                                            details => details.UserId,
                                            (login, details) => new {
                                                FullName = details.UserFullName,
                                                Email = login.UserEmail,
                                                Status = login.UserStatus,
                                                IsAdmin = details.IsAdmin, 
                                                UserId = login.UserId
                                            }).ToList();

        if (!users.Any())
        {
            return NotFound("No users found");
        }

        return Ok(users);
    }

}