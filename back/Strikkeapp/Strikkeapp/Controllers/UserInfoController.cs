using Microsoft.AspNetCore.Http;
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
}