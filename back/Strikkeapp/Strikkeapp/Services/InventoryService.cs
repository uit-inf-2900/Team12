using Strikkeapp.Data.Context;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IInventoryService
{
    public InventoryResult GetInventory(string jwtToken);
}

public class InventoryService : IInventoryService
{
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;

    public InventoryService(StrikkeappDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public InventoryResult GetInventory(string jwtToken)
    {
        // Get userId from token, and handle error
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if(!tokenResult.Success)
        {
            return InventoryResult.ForFailure("Unauthorized");
        }

        Guid userId = tokenResult.UserId;

        try
        {
            // Fetch yarn for user
            var yarnInvs = _context.YarnInventory
                .Where(yi => yi.UserId == userId)
                .Select(yi => new YarnInventoryDto
                {
                    ItemId = yi.ItemID,
                    Name = yi.Name,
                    Manufacturer = yi.Manufacturer,
                    Weight = yi.Weight,
                    Length = yi.Length,
                    Gauge = yi.Gauge,
                    NumItems = yi.NumItems,
                    InUse = yi.InUse,
                    Notes = yi.Notes
                })
                .ToList();

            // Fetch needles for user
            var needleInvs = _context.NeedleInventory
                .Where(ni => ni.UserId == userId)
                .Select(ni => new NeedleInventoryDto
                {
                    ItemId = ni.ItemID,
                    Type = ni.Type,
                    Size = ni.Size,
                    Length = ni.Length,
                    NumItem = ni.NumItem,
                    NumInUse = ni.NumInUse
                })
                .ToList();

            return InventoryResult.ForSuccess(yarnInvs, needleInvs);
        }

        catch (Exception ex)
        {
            return InventoryResult.ForFailure(ex.Message);
        }
    }


}
