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

    [HttpGet]
    [Route("/test")]
    public bool Test()
    {
        return _userService.Test();
    }


    //[HttpGet(Route = "/login")]
    //public

    //[HttpPost(Route = "/createuser")]
}