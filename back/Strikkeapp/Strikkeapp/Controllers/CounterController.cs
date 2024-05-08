﻿using Microsoft.AspNetCore.Mvc;

using Strikkeapp.Models;
using Strikkeapp.Services;
using System.Reflection.Metadata.Ecma335;

namespace Strikkeapp.Controllers;

[Route("api/counter")]
[ApiController]
public class CounterController : ControllerBase
{
    private readonly ICounterService _counterService;

    public CounterController(ICounterService counterService)
    {
        _counterService = counterService;
    }

    [HttpPost]
    [Route("createcounter")]
    public IActionResult CreateCounter([FromBody] CreateCounterRequest request)
    {
        if (!request.IsOK())
        {
            return BadRequest();
        }

        var res = _counterService.CreateCounter(request.userToken, request.name);

        if (!res.Success)
        {
            if (res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res.CounterId);
    }

    [HttpGet]
    [Route("getcounters")]
    public IActionResult GetCounter([FromQuery] string userToken)
    {
        var res = _counterService.GetCounters(userToken);

        if (!res.Success)
        {
            if (res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res.UserCounters);
    }

    [HttpPatch]
    [Route("updatecounter")]
    public IActionResult UpdateCounter([FromBody] UpdateCounterRequest request)
    {
        if (!request.IsOk())
        {
            return BadRequest();
        }

        var res = _counterService.UpdateCounter(request.userToken, request.counterId, request.newName);

        if (!res.Success)
        {
            if (res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }
            if (res.ErrorMessage == "Not found")
            {
                return NotFound("Could not find counter");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok();
    }

    [HttpPatch]
    [Route("incrementcounter")]
    public IActionResult IncrementCounter([FromQuery] string userToken, Guid counterId)
    {
        var result = _counterService.IncrementCounter(userToken, counterId);

        if (!result.Success)
        {
            if (result.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }
            if (result.ErrorMessage == "Not found")
            {
                return NotFound("Could not find counter");
            }

            return StatusCode(500, result.ErrorMessage);
        }

        return Ok();
    }

    [HttpPatch]
    [Route("decrementcounter")]
    public IActionResult DecrementCounter([FromQuery] string userToken, Guid counterId)
    {
        var result = _counterService.DecrementCounter(userToken, counterId);

        if (!result.Success)
        {
            if (result.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }
            if (result.ErrorMessage == "Not found")
            {
                return NotFound("Could not find counter");
            }
        }

        return Ok();
    }

    [HttpDelete]
    [Route("deletecounter")]
    public IActionResult DeleteCounter([FromBody] DeleteCounterRequest request)
    {
        if (!request.IsOk())
        {
            return BadRequest();
        }

        var res = _counterService.DeleteCounter(request.userToken, request.counterId);

        if (!res.Success)
        {
            if (res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }
            if (res.ErrorMessage == "Not found")
            {
                return NotFound("Could not find counter");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok("Counter deleted");
    }
}