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
    [Route("get_inventory")]
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
            return StatusCode(500, "Could not fetch inventory");
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
        // Check request
        if(!request.isOk()) 
        {
            return BadRequest();
        }

        // Run service
        var res = _inventoryService.AddNeedle(request);

        // Check result, and handle errors
        if(!res.Success) 
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized(res.ErrorMessage);
            }

            return StatusCode(500, res.ErrorMessage);
        }
        
        // Return ID of new item
        return Ok(res.ItemId);
    }

    [HttpPatch]
    [Route("updateneedle")]
    public IActionResult UpdateNeedle([FromBody] UpdateItemRequest request)
    {
        if (!request.isOk())
        {
            return BadRequest();
        }

        var res = _inventoryService.UpdateNeedle(request);

        if (!res.Success)
        {
            if (res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized("Unauthorized");
            }

            if (res.ErrorMessage == "Item not found")
            {
                return NotFound(res.ErrorMessage);
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(new
        {
            ItemId = res.ItemId,
            NumItem = res.NewNum
        });
    }

    [HttpPatch]
    [Route("updateneedlesused")]
    public IActionResult UpdateNeedlesUsed([FromBody] UpdateItemRequest request)
    {
        if (!request.isOk())
        {
            return BadRequest();
        }

        var res = _inventoryService.UpdateNeedlesUsed(request);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized(res.ErrorMessage);
            }

            if(res.ErrorMessage == "Item not found for user")
            {
                return NotFound("Item not found");
            }

            if(res.ErrorMessage == "Exceeded inventory")
            {
                return BadRequest("Not enough needles in inventory");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(new
        {
            ItemId = res.ItemId,
            NumUsed = res.NewUsed
        });
    }

    [HttpDelete]
    [Route("deleteneedle")]
    public IActionResult DeleteNeedle([FromBody] DeleteItemRequest request)
    {
        if (!request.isOk())
        {
            return BadRequest();
        }

        var res = _inventoryService.DeleteNeedle(request);

        if (!res.Success)
        {
            if (res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized(res.ErrorMessage);
            }

            if (res.ErrorMessage == "Item not found for user")
            {
                return NotFound("Item not found");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res.ItemId);
    }


    [HttpPost]
    [Route("addyarn")]
    public IActionResult AddYarn([FromBody] AddYarnRequest request)
    {
        if (!request.isOk()) 
        {
            return BadRequest();
        }

        var res = _inventoryService.AddYarn(request);

        if(!res.Success)
        {
            if (res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res.ItemId);
    }

    [HttpPatch]
    [Route("updateyarn")]
    public IActionResult UpdateYarn([FromBody] UpdateItemRequest request)
    {
        if(!request.isOk())
        {
            return BadRequest();
        }

        var res = _inventoryService.UpdateYarn(request);
        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized(res.ErrorMessage);
            }

            if(res.ErrorMessage == "Item not found")
            {
                return NotFound(res.ErrorMessage);
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(new
        {
            ItemId = res.ItemId,
            NumItem = res.NewNum
        });
    }

    [HttpPatch]
    [Route("updateyarnused")]
    public IActionResult UpdateYarnUsed([FromBody] UpdateItemRequest request)
    {
        if (!request.isOk())
        {
            return BadRequest();
        }

        var res = _inventoryService.UpdateYarnUsed(request);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized(res.ErrorMessage);
            }

            if(res.ErrorMessage == "Item not found for user")
            {
                return NotFound("Item not found");
            }

            if(res.ErrorMessage == "Exceeded inventory")
            {
                return BadRequest("Not enough yarn in inventory");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(new
        {
            ItemId = res.ItemId,
            NumUsed = res.NewUsed
        });
    }

    [HttpDelete]
    [Route("deleteyarn")]
    public IActionResult DeleteYarn([FromBody] DeleteItemRequest request)
    {
        if(!request.isOk())
        {
            return BadRequest();
        }

        var res = _inventoryService.DeleteYarn(request);

        if(!res.Success)
        {
            if(res.ErrorMessage == "Unauthorized")
            {
                return Unauthorized(res.ErrorMessage);
            }

            if(res.ErrorMessage == "Item not found for user")
            {
                return NotFound("Item not found");
            }

            return StatusCode(500, res.ErrorMessage);
        }

        return Ok(res.ItemId);
    }
}