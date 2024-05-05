using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IInventoryService
{
    public InventoryGetResult GetInventory(string jwtToken);
    public InventoryResult AddNeedle(AddNeedleRequest request);
    public UpdateInventoryResult UpdateNeedle(UpdateItemRequest request);
    public UpdateInventoryResult UpdateNeedlesUsed(UpdateItemRequest request);
    public DeleteItemResult DeleteNeedle(DeleteItemRequest request);
    public InventoryResult AddYarn(AddYarnRequest request);
    public UpdateInventoryResult UpdateYarn(UpdateYarnRequest request);
    public UpdateInventoryResult UpdateYarnUsed(UpdateItemRequest request);
    public DeleteItemResult DeleteYarn(DeleteItemRequest request);
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
        if (!tokenResult.Success)
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
                    Type = yi.Type,
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
        // Check for valid token
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if (!tokenResult.Success)
        {
            return InventoryResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                // Create new entry
                var needleInventory = new NeedleInventory
                {
                    UserId = userId,
                    Type = request.Type,
                    Size = request.Size,
                    Length = request.Length,
                    NumItem = 1,
                    NumInUse = 0
                };

                // Add entry to database
                _context.NeedleInventory.Add(needleInventory);
                _context.SaveChanges();
                transaction.Commit();

                // Return itemId
                return InventoryResult.ForSuccess(needleInventory.ItemID);
            }

            // Catch any errors
            catch (Exception ex)
            {
                transaction.Rollback();
                return InventoryResult.ForFailure(ex.Message);
            }
        }
    }


    public UpdateInventoryResult UpdateNeedle(UpdateItemRequest request)
    {
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if (!tokenResult.Success)
        {
            return UpdateInventoryResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var needleInventory = _context.NeedleInventory
                    .Where(ni => ni.UserId == userId)
                    .FirstOrDefault(nid => nid.ItemID == request.ItemId);

                if (needleInventory == null)
                {
                    return UpdateInventoryResult.ForFailure("Item not found");
                }

                needleInventory.NumItem = request.NewNum;

                _context.SaveChanges();
                transaction.Commit();

                return UpdateInventoryResult.ForSuccessNum(needleInventory.ItemID, needleInventory.NumItem);
            }

            catch (Exception ex)
            {
                transaction.Rollback();
                return UpdateInventoryResult.ForFailure(ex.Message);
            }
        }
    }

    public UpdateInventoryResult UpdateNeedlesUsed(UpdateItemRequest request)
    {
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if (!tokenResult.Success)
        {
            return UpdateInventoryResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var needleInventory = _context.NeedleInventory
                    .Where(ni => ni.UserId == userId)
                    .FirstOrDefault(nid => nid.ItemID == request.ItemId);

                if (needleInventory == null)
                {
                    return UpdateInventoryResult.ForFailure("Item not found for user");
                }

                if(needleInventory.NumItem < request.NewNum)
                {
                    return UpdateInventoryResult.ForFailure("Exceeded inventory");
                }

                needleInventory.NumInUse = request.NewNum;
                _context.SaveChanges();

                transaction.Commit();
                return UpdateInventoryResult.ForSuccessUsed(needleInventory.ItemID, needleInventory.NumInUse);
            }

            catch (Exception ex)
            {
                transaction.Rollback();
                return UpdateInventoryResult.ForFailure(ex.Message);
            }
        }
    }


    public DeleteItemResult DeleteNeedle(DeleteItemRequest request)
    {
        // Validate token and get userId
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if (!tokenResult.Success)
        {
            return DeleteItemResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var needleToDelte = _context.NeedleInventory
                    .Where(ni => ni.UserId == userId)
                    .FirstOrDefault(nid => nid.ItemID == request.ItemId);

                if (needleToDelte == null)
                {
                    return DeleteItemResult.ForFailure("Item not found for user");
                }

                _context.NeedleInventory.Remove(needleToDelte);
                _context.SaveChanges();

                transaction.Commit();
                return DeleteItemResult.ForSuccess(request.ItemId);
            }

            catch (Exception ex)
            {
                transaction.Rollback();
                return DeleteItemResult.ForFailure(ex.Message);
            }
        }
    }


    public InventoryResult AddYarn(AddYarnRequest request)
    {
        // Check valid token
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if (!tokenResult.Success)
        {
            return InventoryResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                // Create new entry
                var yarnInventory = new YarnInventory
                {
                    UserId = userId,
                    Type = request.Type,
                    Manufacturer = request.Manufacturer,
                    Color = request.Color,
                    Batch_Number = request.Batch_Number,
                    Weight = request.Weight,
                    Length = request.Length,
                    Gauge = request.Gauge,
                    NumItems = 1,
                    InUse = 0,
                    Notes = request.Notes
                };

                // Add new entry to db
                _context.YarnInventory.Add(yarnInventory);
                _context.SaveChanges();
                transaction.Commit();

                return InventoryResult.ForSuccess(yarnInventory.ItemID);
            }

            // Handle errors
            catch (Exception ex)
            {
                transaction.Rollback();
                return InventoryResult.ForFailure(ex.Message);
            }
        }

    }

    public UpdateInventoryResult UpdateYarn(UpdateYarnRequest request)
    {
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if (!tokenResult.Success)
        {
            return UpdateInventoryResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var yarnInventory = _context.YarnInventory
                    .Where(yi => yi.UserId == userId)
                    .FirstOrDefault(yid => yid.ItemID == request.ItemId);

                if(yarnInventory == null)
                {
                    return UpdateInventoryResult.ForFailure("Item not found");
                }

                if(request.NewNum != yarnInventory.NumItems)
                {
                    yarnInventory.NumItems = request.NewNum;
                    _context.SaveChanges();
                }

                if(request.Type != null){
                    yarnInventory.Type = request.Type;
                    _context.SaveChanges();
                }

                if(request.Manufacturer != null)
                {
                    yarnInventory.Manufacturer = request.Manufacturer;
                    _context.SaveChanges();
                }

                if(request.Color != null){
                    yarnInventory.Batch_Number = request.Batch_Number;
                    yarnInventory.Color = request.Color;
                }

                if(request.Weight != null)
                {
                    yarnInventory.Weight = request.Weight;
                    _context.SaveChanges();
                }

                if (request.Length != null)
                {
                    yarnInventory.Length = request.Length;
                    _context.SaveChanges();
                }

                if(request.Gauge != null)
                {
                    yarnInventory.Gauge = request.Gauge;
                    _context.SaveChanges();
                }

                if(request.Notes != null)
                {
                    yarnInventory.Notes = request.Notes;
                    _context.SaveChanges();
                }

                transaction.Commit();
                return UpdateInventoryResult.ForSuccessNum(yarnInventory.ItemID, yarnInventory.NumItems);
            }
            catch(Exception ex)
            {
                transaction.Rollback();
                return UpdateInventoryResult.ForFailure(ex.Message);
            }
        }
    }

    public UpdateInventoryResult UpdateYarnUsed(UpdateItemRequest request)
    {
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if (!tokenResult.Success)
        {
            return UpdateInventoryResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var yarnInventory = _context.YarnInventory
                    .Where(yi => yi.UserId == userId)
                    .FirstOrDefault(yid => yid.ItemID == request.ItemId);

                if(yarnInventory == null)
                {
                    return UpdateInventoryResult.ForFailure("Item not found for user");
                }

                if(yarnInventory.NumItems < request.NewNum)
                {
                    return UpdateInventoryResult.ForFailure("Exceeded inventory");
                }

                yarnInventory.InUse = request.NewNum;
                _context.SaveChanges();

                transaction.Commit();
                return UpdateInventoryResult.ForSuccessUsed(yarnInventory.ItemID, yarnInventory.InUse);
            }
            
            catch(Exception ex)
            {
                transaction.Rollback();
                return UpdateInventoryResult.ForFailure(ex.Message);
            }
        }
    }

    public DeleteItemResult DeleteYarn(DeleteItemRequest request)
    {
        var tokenResult = _tokenService.ExtractUserID(request.UserToken);
        if(!tokenResult.Success)
        {
            return DeleteItemResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var yarnToDelete = _context.YarnInventory
                    .Where(yi => yi.UserId == userId)
                    .FirstOrDefault(yid => yid.ItemID == request.ItemId);

                    if(yarnToDelete == null)
                    {
                        return DeleteItemResult.ForFailure("Item not found for user");
                    }

                    _context.YarnInventory.Remove(yarnToDelete);
                    _context.SaveChanges();

                    transaction.Commit();
                    return DeleteItemResult.ForSuccess(request.ItemId);
            }
            catch(Exception ex)
            {
                transaction.Rollback();
                return DeleteItemResult.ForFailure(ex.Message);
            }
        }
    }
}