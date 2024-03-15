using Microsoft.AspNetCore.Mvc;

using Strikkeapp.Services;

namespace Strikkeapp.Controllers;

[ApiController]
[Route("api/userinfo")]
public class UserInfoController : ControllerBase
{
    private readonly IUserInfoService _userInfoService;
    public UserInfoController(IUserInfoService userInfoService)
    {
        _userInfoService = userInfoService;
    }

    public class UpdateRequest
    {
        public string Token { get; set; } = string.Empty;
        public string? UserFullName {get; set;}
        public string? UserEmail { get; set;}
        public string? OldPassword { get; set;}
        public string? NewPassword { get; set;}
    }   


    [HttpGet]
    [Route("getprofileinfo")]
    public IActionResult GetProfileInfo([FromQuery] string userToken)
    {
        var result = _userInfoService.GetProfileInfo(userToken);
        if (!result.Success)
        {
            if (result.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }
            if (result.ErrorMessage == "User not found")
            {
                return NotFound(result.ErrorMessage);
            }
        }

        return Ok(new
        {
            UserFullName = result.UserFullName,
            UserEmail = result.UserEmail,
        });
    }

    [HttpPatch]
    [Route("updateprofileinfo")]
    public IActionResult UpdateProfileInfo([FromBody] UpdateRequest request)
    {
        var result = _userInfoService.UpdateProfileInfo(request.Token,
            request.UserFullName, request.UserEmail, request.OldPassword, request.NewPassword);
        if (!result.Success)
        {
            if (result.ErrorMessage == "Unauthorized" || result.ErrorMessage == "Wrong password")
            {
                return Unauthorized(result.ErrorMessage);
            }

            if (result.ErrorMessage == "No fields to update" || result.ErrorMessage == "Password missing")
            {
                return BadRequest(result.ErrorMessage);
            }

            if (result.ErrorMessage == "User not found")
            {
                return NotFound(result.ErrorMessage);
            }

            return StatusCode(500, result.ErrorMessage);
        }

        return Ok(result.UpdatedFields);
    }
}