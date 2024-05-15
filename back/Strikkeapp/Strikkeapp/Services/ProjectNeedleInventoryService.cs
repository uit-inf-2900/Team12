using Strikkeapp.Data.Context;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface IProjectNeedleInventoryService
{
    bool SetNeedleAsUsed(string userToken, Guid needleId);
    bool SetNeedleAsUsed(string userToken, List<Guid>? needleId);
    bool SetNeedleAsUnused(string userToken, Guid needleId);
    bool SetNeedleAsUnused(string userToken, List<Guid>? needleId);

}

public class ProjectNeedleInventoryService : IProjectNeedleInventoryService
{
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IInventoryService _inventoryService;
    public ProjectNeedleInventoryService(StrikkeappDbContext context, ITokenService tokenService, IInventoryService inventoryService)
    {
        _context = context;
        _tokenService = tokenService;
        _inventoryService = inventoryService;
    }

    public bool SetNeedleAsUsed(string userToken, Guid needleId)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
            throw new UnauthorizedAccessException();

        var needle = _inventoryService.GetNeedle(userToken, needleId);

        var updateRequest = new UpdateItemRequest
        {
            ItemId = needle.ItemId,
            UserToken = userToken,
            NewNum = needle.NumInUse + 1
        };

        var updateResult = _inventoryService.UpdateNeedlesUsed(updateRequest);

        if (!updateResult.Success)
            throw new Exception("Error updating needle in use");

        return true;
    }

    public bool SetNeedleAsUsed(string userToken, List<Guid>? needleId)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
            throw new UnauthorizedAccessException();

        if (needleId == null)
            return true;

        foreach (var id in needleId)
        {
            var needle = _inventoryService.GetNeedle(userToken, id);

            var updateRequest = new UpdateItemRequest
            {
                ItemId = needle.ItemId,
                UserToken = userToken,
                NewNum = needle.NumInUse + 1
            };

            var updateResult = _inventoryService.UpdateNeedlesUsed(updateRequest);

            if (!updateResult.Success)
                throw new Exception("Error updating needle in use");
        }
        return true;
    }

    public bool SetNeedleAsUnused(string userToken, Guid needleId)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
            throw new UnauthorizedAccessException();

        var needle = _inventoryService.GetNeedle(userToken, needleId);

        if(needle.NumInUse == 0)
            return true;

        var updateRequest = new UpdateItemRequest
        {
            ItemId = needle.ItemId,
            UserToken = userToken,
            NewNum = needle.NumInUse - 1
        };

        var updateResult = _inventoryService.UpdateNeedlesUsed(updateRequest);

        if (!updateResult.Success)
            throw new Exception("Error updating needle in use");

        return true;
    }

    public bool SetNeedleAsUnused(string userToken, List<Guid>? needleId)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
            throw new UnauthorizedAccessException();

        if (needleId == null)
            return true;

        foreach (var id in needleId)
        {
            var needle = _inventoryService.GetNeedle(userToken, id);

            if (needle.NumInUse == 0)
                continue;

            var updateRequest = new UpdateItemRequest
            {
                ItemId = needle.ItemId,
                UserToken = userToken,
                NewNum = needle.NumInUse - 1
            };

            var updateResult = _inventoryService.UpdateNeedlesUsed(updateRequest);

            if (!updateResult.Success)
                throw new Exception("Error updating needle in use");
        }
        return true;
    }
}
