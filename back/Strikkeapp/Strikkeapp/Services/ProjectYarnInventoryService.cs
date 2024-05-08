using System;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;
using AutoMapper;

namespace Strikkeapp.Services;

public interface IProjectYarnInventoryService
{
    Guid? CreateYarnInventory(Guid yarnId, Guid projectId, string userToken, int numUse);
    bool DeleteYarnInventory(Guid projectInventoryId, string userToken);
    bool DeleteYarnInventory(List<Guid> projectInventoryId, string userToken);
    int GetNumInUseByProject(Guid itemId, Guid projectId, string userToken);
    public bool SetYarnInventoryForCompletedProject(string userToken, Guid itemId, Guid projectId);
    public bool SetYarnInventoryForCompletedProject(string userToken, List<Guid>? itemId, Guid projectId);

}

public class ProjectYarnInventoryService : IProjectYarnInventoryService
{
    private readonly StrikkeappDbContext _context;
    private readonly IInventoryService _inventoryService;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;


    public ProjectYarnInventoryService(StrikkeappDbContext context, IInventoryService inventoryService, ITokenService tokenService, IMapper mapper)
	{
        _context = context;
        _inventoryService = inventoryService;
        _tokenService = tokenService;
        _mapper = mapper;
	}

    public Guid? CreateYarnInventory(Guid yarnId, Guid projectId, string userToken, int numUse)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        // validate that amount of yarn is available and exists
        var yarnInventory = _inventoryService.GetSingleYarnFromInventory(userToken, yarnId);

        if (yarnInventory.NumItems - yarnInventory.InUse < numUse)
            throw new ArgumentException($@"Inventory of this yarn is lower than requested amount. 
                Number available in inventory is: {yarnInventory.NumItems - yarnInventory.InUse}, 
                but requested amount is {numUse}.");

        var updateInventoryRequest = new UpdateItemRequest
        {
            UserToken = userToken,
            ItemId = yarnId,
            NewNum = yarnInventory.InUse + numUse
        };

        var updateInventoryResult = _inventoryService.UpdateYarnUsed(updateInventoryRequest);

        if (!updateInventoryResult.Success)
            throw new Exception("Error updating yarn inventory");

        var projectYarnInventory = new ProjectYarnInventoryEntity
        {
            ProjectInventoryId = Guid.NewGuid(),
            UserId = tokenResult.UserId,
            ItemId = yarnId,
            ProjectId = projectId,
            NumberInUse = numUse
        };

        var createdInventory = _context.ProjectYarnInventory.Add(projectYarnInventory);

        var saveResult = _context.SaveChanges();

        if (saveResult >= 1)
            return createdInventory.Entity.ProjectInventoryId;

        return null;
    }

    public bool DeleteYarnInventory(Guid projectInventoryId, string userToken)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        var projectInventory = _context.ProjectYarnInventory.Where(pyi => pyi.ProjectInventoryId == projectInventoryId).FirstOrDefault();

        if (projectInventory == null)
            throw new Exception("Project does not have this in its inventory");

        // validate that amount of yarn is available and exists
        var yarnInventory = _inventoryService.GetSingleYarnFromInventory(userToken, projectInventory.ItemId);

        var updateInventoryRequest = new UpdateItemRequest
        {
            UserToken = userToken,
            ItemId = projectInventory.ItemId,
            NewNum = yarnInventory.InUse - projectInventory.NumberInUse,
        };

        var updateInventoryResult = _inventoryService.UpdateYarnUsed(updateInventoryRequest);

        if (!updateInventoryResult.Success)
            throw new Exception("Error updating yarn inventory");

        _context.ProjectYarnInventory.Remove(projectInventory);

        var deleteResult = _context.SaveChanges();

        if (deleteResult >= 1)
            return true;

        return false;
    }

    public bool DeleteYarnInventory(List<Guid> projectInventoryId, string userToken)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        var projectInventory = _context.ProjectYarnInventory.Where(pyi => projectInventoryId.Contains(pyi.ProjectInventoryId)).ToList();

        if (projectInventory == null)
            throw new Exception("Project does not have this yarn(s) in its inventory");

        foreach (var inventory in projectInventory)
        {
            // validate that amount of yarn exists
            var yarnInventory = _inventoryService.GetSingleYarnFromInventory(userToken, inventory.ItemId);

            var updateInventoryRequest = new UpdateItemRequest
            {
                UserToken = userToken,
                ItemId = inventory.ItemId,
                NewNum = yarnInventory.InUse - inventory.NumberInUse,
            };

            var updateInventoryResult = _inventoryService.UpdateYarnUsed(updateInventoryRequest);

            if (!updateInventoryResult.Success)
                throw new Exception("Error updating yarn inventory");
        }


        _context.ProjectYarnInventory.RemoveRange(projectInventory);

        var deleteResult = _context.SaveChanges();

        if (deleteResult >= 1)
            return true;

        return false;
    }

    public bool SetYarnInventoryForCompletedProject(string userToken, Guid itemId, Guid projectId)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        var inventory = GetProjectYarnInventoryEntity(itemId, tokenResult.UserId, projectId);

        if (inventory == null)
            return false;

        var yarn = _inventoryService.GetSingleYarnFromInventory(userToken, inventory.ItemId);

        var updateInventoryRequest = new UpdateItemRequest
        {
            UserToken = userToken,
            ItemId = inventory.ItemId,
            NewNum = yarn.InUse - inventory.NumberInUse,
        };

        var updateInventoryResult = _inventoryService.UpdateYarnUsed(updateInventoryRequest);

        if (!updateInventoryResult.Success)
            return false;

        var updateYarnRequest = _mapper.Map<UpdateYarnRequest>(yarn);
        updateYarnRequest.NewNum = yarn.NumItems - inventory.NumberInUse;

        var update = _inventoryService.UpdateYarn(updateYarnRequest);

        if (!update.Success)
            return false;
        return true;
    }

    public bool SetYarnInventoryForCompletedProject(string userToken, List<Guid>? itemId, Guid projectId)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        if (itemId == null || !itemId.Any())
            return true;

        foreach (var id in itemId)
        {
            var inventory = GetProjectYarnInventoryEntity(id, tokenResult.UserId, projectId);

            if (inventory == null)
                return false;

            var yarn = _inventoryService.GetSingleYarnFromInventory(userToken, inventory.ItemId);

            var updateInventoryRequest = new UpdateItemRequest
            {
                UserToken = userToken,
                ItemId = inventory.ItemId,
                NewNum = yarn.InUse - inventory.NumberInUse,
            };

            var updateInventoryResult = _inventoryService.UpdateYarnUsed(updateInventoryRequest);

            if (!updateInventoryResult.Success)
                return false;

            var updateYarnRequest = _mapper.Map<UpdateYarnRequest>(yarn);
            updateYarnRequest.NewNum = yarn.NumItems - inventory.NumberInUse;

            var update = _inventoryService.UpdateYarn(updateYarnRequest);

            if (!update.Success)
                return false;
        }
        return true;
    }

    public int GetNumInUseByProject(Guid itemId, Guid projectId, string userToken)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        var inventory = GetProjectYarnInventoryEntity(itemId, tokenResult.UserId, projectId);

        if (inventory == null)
            return 0;

        return inventory.NumberInUse;
    }

    private ProjectYarnInventoryEntity? GetProjectYarnInventoryEntity(Guid itemId, Guid userId, Guid projectId)
    {
        var inventory = _context.ProjectYarnInventory.Where(pyi => pyi.ItemId == itemId && pyi.ProjectId == projectId && pyi.UserId == userId).FirstOrDefault();

        if (inventory == null)
            return null;

        return inventory;
    }
}

