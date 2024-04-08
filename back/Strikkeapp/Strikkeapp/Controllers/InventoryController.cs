using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        var res = _inventoryService.GetInventory(userToken);
        if(!res.Success) 
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized("Invalid token");
            }

            return (StatusCode(500, "Could not fetch inventory"));
        }

        return Ok(new
        {
            yarnInventory = res.YarnInventories,
            needleInventory = res.NeedleInventories
        });
    }
}
