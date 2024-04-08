using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IInventoryService
{
    public InventoryGetResult GetInventory(string jwtToken);
    public InventoryResult AddNeedle(AddNeedleRequest request);
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

    public InventoryGetResult GetInventory(string jwtToken)
    {
        // Get userId from token, and handle error
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if(!tokenResult.Success)
        {
            return InventoryGetResult.ForFailure("Unauthorized");
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

            return InventoryGetResult.ForSuccess(yarnInvs, needleInvs);
        }

        catch (Exception ex)
        {
            return InventoryGetResult.ForFailure(ex.Message);
        }
    }

    public InventoryResult AddNeedle(AddNeedleRequest request)
    {
        var tokenResult = _tokenService.ExtractUserID(request.userToken);
        if(!tokenResult.Success) 
        {
            return InventoryResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using(var transaction = _context.Database.BeginTransaction()) 
        {
            try
            {
                var exsistingItem = _context.NeedleInventory
                    .Any(ni => ni.UserId == userId && ni.Type == request.Type);

                if (exsistingItem) 
                {
                    return InventoryResult.ForFailure("Duplicate type");
                }
                   

                var needleInventory = new NeedleInventory
                {
                    UserId = userId,
                    Type = request.Type,
                    Size = request.Size,
                    Length = request.Length,
                    NumItem = 0,
                    NumInUse = 0
                };

                _context.NeedleInventory.Add(needleInventory);

                _context.SaveChanges();
                transaction.Commit();

                return InventoryResult.ForSuccess(needleInventory.ItemID);
            }

            catch(Exception ex) 
            {
                transaction.Rollback();
                return InventoryResult.ForFailure(ex.Message);
            }
        }
    }
}
