using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Controllers;

[Route("api/inventory")]
[ApiController]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    [Route("/get_inventory")]
    public IActionResult GetInventory([FromQuery] string userToken)
    {
        // Run service and check result
        var res = _inventoryService.GetInventory(userToken);
        if(!res.Success) 
        {
            // Unauthorized if invalid token
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized("Invalid token");
            }

            // Internal error
            return (StatusCode(500, "Could not fetch inventory"));
        }

        // Return the lists
        return Ok(new
        {
            yarnInventory = res.YarnInventories,
            needleInventory = res.NeedleInventories
        });
    }

    [HttpPost]
    [Route("addneedle")]
    public IActionResult AddNeedle([FromBody] AddNeedleRequest request)
    {
        if(!request.isOk()) 
        {
            return BadRequest();
        }

        var res = _inventoryService.AddNeedle(request);

        if(!res.Success) 
        {
            if(res.ErrorMessage == "Duplicate type")
            {
                return Conflict("Type already exsits");
            }

            return (StatusCode(500, res.ErrorMessage));
        }

        return Ok(res.ItemId);
    }
}
