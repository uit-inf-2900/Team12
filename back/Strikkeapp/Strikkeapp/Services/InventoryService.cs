using Azure.Core;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Data.Migrations;
using Strikkeapp.Models;
using AutoMapper;

namespace Strikkeapp.Services;

public interface IInventoryService
{
    public InventoryGetResult GetInventory(string jwtToken);
    public YarnInventoryDto GetSingleYarnFromInventory(string userToken, Guid itemId);
    public IEnumerable<NeedleInventoryDto> GetNeedles(string userToken, IEnumerable<Guid>? needleIds);
    public IEnumerable<YarnInventoryDto> GetYarns(string userToken, IEnumerable<Guid>? yarnIds);
    public InventoryResult AddNeedle(AddNeedleRequest request);
    public UpdateInventoryResult UpdateNeedle(UpdateItemRequest request);
    public UpdateInventoryResult UpdateNeedlesUsed(UpdateItemRequest request);
    public DeleteItemResult DeleteNeedle(DeleteItemRequest request);
    public InventoryResult AddYarn(AddYarnRequest request);
    public UpdateInventoryResult UpdateYarn(UpdateYarnRequest request);
    public UpdateInventoryResult UpdateYarnUsed(UpdateItemRequest request);
    public DeleteItemResult DeleteYarn(DeleteItemRequest request);
    public InventoryGetResult GetAllInventory(string jwtToken);
}

public class InventoryService : IInventoryService
{
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public InventoryService(StrikkeappDbContext context, ITokenService tokenService, IMapper mapper)
    {
        _context = context;
        _tokenService = tokenService;
        _mapper = mapper;
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
                    Batch_Number = yi.Batch_Number,
                    Color = yi.Color,
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

    public InventoryGetResult GetAllInventory(string jwtToken)
    {
        // Get userId from token, and handle error
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if (!tokenResult.Success)
        {
            return InventoryGetResult.ForFailure("Unauthorized");
        }

        Guid userId = tokenResult.UserId;
        var isAdmin = _context.UserDetails.FirstOrDefault(a => a.UserId == userId); 

        // So if the user is not an admin return Unauthorized
        if (!isAdmin!.IsAdmin || isAdmin == null)
        {
            return InventoryGetResult.ForFailure("Unauthorized");
        }

        try
        {
            // Fetch all yarn 
            var yarnInvs = _context.YarnInventory
                .Select(yi => new YarnInventoryDto
                {
                    ItemId = yi.ItemID,
                    Type = yi.Type,
                    Manufacturer = yi.Manufacturer,
                    Batch_Number = yi.Batch_Number,
                    Color = yi.Color,
                    Weight = yi.Weight,
                    Length = yi.Length,
                    NumItems = yi.NumItems,
                })
                .ToList();

            // Fetch all needles
            var needleInvs = _context.NeedleInventory
                .Select(ni => new NeedleInventoryDto
                {
                    ItemId = ni.ItemID,
                    Type = ni.Type,
                    Size = ni.Size,
                    Length = ni.Length,
                })
                .ToList();

            return InventoryGetResult.ForSuccess(yarnInvs, needleInvs);
        }

        catch (Exception ex)
        {
            return InventoryGetResult.ForFailure(ex.Message);
        }
    }

    public YarnInventoryDto GetSingleYarnFromInventory(string userToken, Guid itemId)
    {
        // Check for valid token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            throw new ArgumentException("User token is invalid");
        }

        var yarnInventory = _context.YarnInventory.Where(yi => yi.ItemID == itemId && yi.UserId == tokenResult.UserId).FirstOrDefault();

        if (yarnInventory == null)
            throw new Exception("This yarn does not exist in user´s inventory");

        return _mapper.Map<YarnInventoryDto>(yarnInventory);
    }

    public IEnumerable<NeedleInventoryDto> GetNeedles(string userToken, IEnumerable<Guid>? needleIds)
    {
        // Check for valid token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
            throw new ArgumentException("User token is invalid");  

        if (needleIds == null || !needleIds.Any())
            return new List<NeedleInventoryDto>();

        var needles = _context.NeedleInventory
                        .Where(ni => needleIds.Contains(ni.ItemID))
                        .Select(ni => _mapper.Map<NeedleInventoryDto>(ni))
                        .AsEnumerable();

        return needles;
    }

    public IEnumerable<YarnInventoryDto> GetYarns(string userToken, IEnumerable<Guid>? yarnIds)
    {
        // Check for valid token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
            throw new ArgumentException("User token is invalid");

        if (yarnIds == null || !yarnIds.Any())
            return new List<YarnInventoryDto>();

        var yarns = _context.YarnInventory
                        .Where(yi => yarnIds.Contains(yi.ItemID))
                        .Select(yi => _mapper.Map<YarnInventoryDto>(yi))
                        .AsEnumerable();

        return yarns;
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
                var needleInventory = _mapper.Map<NeedleInventory>(request);
                needleInventory.UserId = tokenResult.UserId;

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
                var yarnInventory = _mapper.Map<YarnInventory>(request);
                yarnInventory.UserId = tokenResult.UserId;

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

                if(request.NewNum != yarnInventory.NumItems && request.NewNum>0)
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