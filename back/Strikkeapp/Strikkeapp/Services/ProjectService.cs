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
    bool DeleteProject(Guid projectId, string userToken);

}

public class ProjectService : IProjectService
{
    private readonly ITokenService _tokenService;
    private readonly StrikkeappDbContext _context;
    private readonly IProjectYarnInventoryService _projectYarnService;


    public ProjectService(ITokenService tokenService, StrikkeappDbContext context, IProjectYarnInventoryService projectYarnInventoryService)
	{
        _tokenService = tokenService;
        _context = context;
        _projectYarnService = projectYarnInventoryService;
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
            // fetch project data from database
            var projectEntities = _context.Projects
                .Where(p => p.UserId == tokenResult.UserId)
                .Select(p => new 
                {
                    ProjectId = p.ProjectId,
                    RecipeId = p.RecipeId,
                    Status = p.Status,
                    Needles = p.NeedleIds,
                    Yarns = p.YarnIds,
                    Notes = p.Notes,
                    ProjectName = p.ProjectName
                }
            ).ToList();

            var projectModels = new List<ProjectModel>();

            // Get necessary data to create a project model
            foreach (var project in projectEntities)
            {
                var projectModel = new ProjectModel
                {
                    ProjectId = project.ProjectId,
                    RecipeId = project.RecipeId,
                    Status = project.Status,
                    // Get needle info from needle inventory table
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
                    // get yarn info from yarn inventory table
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
                            // get the number of yarn in use for the project from project inventory
                            InUse = _projectYarnService.GetNumInUseByProject(yi.ItemID, project.ProjectId, jwtToken),
                            Notes = yi.Notes
                        }).AsEnumerable(),
                    Notes = project.Notes,
                    ProjectName = project.ProjectName

                };
                projectModels.Add(projectModel);
            }
            // return all projects found
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
            YarnIds = project.YarnIds != null ? project.YarnIds.Keys.ToList() : null,
            Notes = project.Notes,
            UserId = tokenResult.UserId,
            ProjectName = project.ProjectName
        };

        var addedProject = _context.Projects.Add(projectEntity);

        var result = _context.SaveChanges();

        if (project.YarnIds != null && project.YarnIds.Count > 0)
        {
            var inventoryIds = new List<Guid>();
            foreach (var yarn in project.YarnIds)
            {
                var projectYarnInventoryId = _projectYarnService.CreateYarnInventory(yarn.Key, addedProject.Entity.ProjectId, jwtToken, yarn.Value);
                if (projectYarnInventoryId == null)
                    throw new Exception("Yarn inventory for project failed to add yarn(s)");
                inventoryIds.Add(projectYarnInventoryId.Value);
            }

            var createdProject = _context.Projects.Where(p => p.ProjectId == addedProject.Entity.ProjectId).FirstOrDefault();
            if (createdProject == null)
                throw new Exception("Could not update the new project with yarn(s) used");

            createdProject.ProjectInventoryIds = inventoryIds;
            var resultInventoryChanges = _context.SaveChanges();
            if (resultInventoryChanges >= 1)
                return true;
        }

        if (result >= 1)
            return true;
        return false;

    }

    public bool DeleteProject(Guid projectId, string userToken)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        var project = _context.Projects.Where(p => p.ProjectId == projectId && p.UserId == tokenResult.UserId).FirstOrDefault();

        if (project == null)
            throw new ArgumentException($"Project with id {projectId} does not exist for user with id {tokenResult.UserId}");

        if (project.ProjectInventoryIds != null && project.ProjectInventoryIds.Count > 0)
            _projectYarnService.DeleteYarnInventory(project.ProjectInventoryIds, userToken);

        _context.Projects.Remove(project);

        var result = _context.SaveChanges();

        if (result >= 1)
            return true;

        return false;
    }

}

