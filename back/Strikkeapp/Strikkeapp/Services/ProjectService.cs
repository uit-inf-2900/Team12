using System;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;
using Strikkeapp.Recipes.Models;
using Strikkeapp.Data.Entities;

namespace Strikkeapp.Services;

public interface IProjectService
{
    List<ProjectModel> GetProjects(string jwtToken);
    bool CreateProject(string jwtToken, ProjectCreateModel project);

}

public class ProjectService : IProjectService
{
    private readonly ITokenService _tokenService;
    private readonly StrikkeappDbContext _context;


    public ProjectService(ITokenService tokenService, StrikkeappDbContext context)
	{
        _tokenService = tokenService;
        _context = context;
	}

    public List<ProjectModel> GetProjects(string jwtToken)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        try
        {
            var projectEntities = _context.Projects
                .Where(p => p.UserId == tokenResult.UserId)
                .Select(p => new 
                {
                    ProjectId = p.ProjectId,
                    RecipeId = p.RecipeId,
                    Status = p.Status,
                    Needles = p.NeedleIds,
                    Yarns = p.YarnIds,
                    Notes = p.Notes
                }
            ).ToList();

            var projectModels = new List<ProjectModel>();

            foreach (var project in projectEntities)
            {
                var projectModel = new ProjectModel
                {
                    ProjectId = project.ProjectId,
                    RecipeId = project.RecipeId,
                    Status = project.Status,
                    Needles = _context.NeedleInventory
                        .Where(ni => project.Needles.Contains(ni.ItemID))
                        .Select(ni => new NeedleInventoryDto
                        {
                            ItemId = ni.ItemID,
                            Type = ni.Type,
                            Size = ni.Size,
                            Length = ni.Length,
                            NumItem = ni.NumItem,
                            NumInUse = ni.NumInUse
                        }).AsEnumerable(),
                    Yarns = _context.YarnInventory
                        .Where(yi => project.Yarns.Contains(yi.ItemID))
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
                        }).AsEnumerable(),
                    Notes = project.Notes

                };
                projectModels.Add(projectModel);
            }

            return projectModels;

        }
        catch (Exception ex)
        {
            throw new Exception("Error when getting projects: " + ex.Message);
        }

        
    }

    public bool CreateProject(string jwtToken, ProjectCreateModel project)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        var projectEntity = new ProjectEntity
        {
            RecipeId = project.RecipeId,
            Status = project.Status,
            NeedleIds = project.NeedleIds,
            YarnIds = project.YarnIds,
            Notes = project.Notes,
            UserId = tokenResult.UserId
        };

        _context.Projects.Add(projectEntity);
        var result = _context.SaveChanges();
        if (result >= 1)
            return true;
        return false;

    }

    private ProjectModel? GetProject(Guid projectId, Guid userId)
    {
        try
        {
            var project = _context.Projects
                .Where(p => p.UserId == userId)
                .Select(p => new ProjectModel
                {
                    ProjectId = p.ProjectId,
                    RecipeId = p.RecipeId,
                    Status = p.Status,
                    Needles = p.NeedleIds != null ? _context.NeedleInventory
                        .Where(ni => p.NeedleIds.Contains(ni.ItemID))
                        .Select(ni => new NeedleInventoryDto
                        {
                            ItemId = ni.ItemID,
                            Type = ni.Type,
                            Size = ni.Size,
                            Length = ni.Length,
                            NumItem = ni.NumItem,
                            NumInUse = ni.NumInUse
                        }).ToList() : null,
                    Yarns = p.YarnIds != null ? _context.YarnInventory
                        .Where(yi => p.YarnIds.Contains(yi.ItemID))
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
                        }).ToList() : null,
                    Notes = p.Notes
                }
            ).FirstOrDefault();
            return project;

        }
        catch (Exception ex)
        {
            throw new Exception("Error when getting projects: " + ex.Message);
        }
    }
}

