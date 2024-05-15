using System;
using Strikkeapp.Data.Context;
using Strikkeapp.Models;
using Strikkeapp.Recipes.Models;
using Strikkeapp.Data.Entities;
using AutoMapper;
using Strikkeapp.Data.Migrations;
using Morcatko.AspNetCore.JsonMergePatch;

namespace Strikkeapp.Services;

public interface IProjectService
{
    List<ProjectModel> GetProjects(string jwtToken);
    bool CreateProject(string jwtToken, ProjectCreateModel project);
    ProjectModel GetProject(string jwtToken, Guid projectId);
    bool DeleteProject(Guid projectId, string userToken);
    bool CompleteProject(string userToken, Guid projectId);
    bool PatchProject(Guid projectId, JsonMergePatchDocument<ProjectCreateModel> projectPatch, string userToken);

}

public class ProjectService : IProjectService
{
    private readonly ITokenService _tokenService;
    private readonly StrikkeappDbContext _context;
    private readonly IProjectYarnInventoryService _projectYarnService;
    private readonly IInventoryService _inventoryService;
    private readonly IMapper _mapper;


    public ProjectService(ITokenService tokenService, StrikkeappDbContext context, IProjectYarnInventoryService projectYarnInventoryService, IInventoryService inventoryService, IMapper mapper)
	{
        _tokenService = tokenService;
        _context = context;
        _projectYarnService = projectYarnInventoryService;
        _inventoryService = inventoryService;
        _mapper = mapper;
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
            var projectEntities = _context.Projects.Where(p => p.UserId == tokenResult.UserId).ToList();
            var projectModels = new List<ProjectModel>();

            foreach (var project in projectEntities)
            {
                var projectModel = _mapper.Map<ProjectModel>(project);
                projectModel.Needles = _inventoryService.GetNeedles(jwtToken, project.NeedleIds);
                projectModel.Yarns = GetYarnsForProject(jwtToken, project.YarnIds, project.ProjectId);
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

    public ProjectModel GetProject(string jwtToken, Guid projectId)
    {
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        var project = _context.Projects.Where(p => p.ProjectId == projectId && p.UserId == tokenResult.UserId).FirstOrDefault();

        if (project == null)
            throw new ArgumentException("could not fetch project from ID");


        var projectModel = _mapper.Map<ProjectModel>(project);
        projectModel.Needles = _inventoryService.GetNeedles(jwtToken, project.NeedleIds);
        projectModel.Yarns = GetYarnsForProject(jwtToken, project.YarnIds, project.ProjectId);

        return projectModel;

    }

 
    public bool CreateProject(string jwtToken, ProjectCreateModel project)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if (tokenResult.Success == false)
        {
            throw new ArgumentException(tokenResult.ErrorMessage);
        }

        if (project.Status == Enums.ProjectStatus.Completed)
            throw new Exception("Project cannot be created as completed. Create project with different status, then set as completed.");

        var projectEntity = _mapper.Map<ProjectEntity>(project);
        projectEntity.UserId = tokenResult.UserId;

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

    public bool CompleteProject(string userToken, Guid projectId)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
            throw new ArgumentException(tokenResult.ErrorMessage);

        var project = _context.Projects.Where(p => p.ProjectId == projectId && p.UserId == tokenResult.UserId).FirstOrDefault();

        if (project == null)
            throw new ArgumentException($"Project with id: {projectId} does not exist for logged in user");

        if (project.Status == Enums.ProjectStatus.Completed)
            throw new ArgumentException($"Project with id: {projectId} is already set as completed");

        var updateInventory = _projectYarnService.SetYarnInventoryForCompletedProject(userToken, project.YarnIds, project.ProjectId);

        project.Status = Enums.ProjectStatus.Completed;

        var result = _context.SaveChanges();

        if (result > 0)
            return true;
        return false;
    }

    public bool PatchProject(Guid projectId, JsonMergePatchDocument<ProjectCreateModel> projectPatch, string userToken)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
            throw new ArgumentException(tokenResult.ErrorMessage);

        var project = _context.Projects.Where(p => p.ProjectId == projectId && p.UserId == tokenResult.UserId).FirstOrDefault();

        if (project == null)
            throw new ArgumentException($"Project with id: {projectId} does not exist for logged in user");

        if (project.Status == Enums.ProjectStatus.Completed)
            throw new ArgumentException($"Project with id: {projectId} is already set as completed");

        List<Guid>? yarnInventory = project.ProjectInventoryIds;
        List<Guid>? yarnIds = project.YarnIds;
        List<Guid>? needleIds = project.NeedleIds;

        // if the patch contains yarns, patch the yarns in the project inventory
        if (projectPatch.Model.YarnIds != null && projectPatch.Model.YarnIds.Keys.Count != 0)
        {
            if (project.ProjectInventoryIds != null && project.ProjectInventoryIds.Count > 0)
                _projectYarnService.DeleteYarnInventory(project.ProjectInventoryIds, userToken);

            yarnInventory = _projectYarnService.CreateYarnInventory(projectPatch.Model.YarnIds, projectId, userToken);
            yarnIds = projectPatch.Model.YarnIds.Keys.ToList();
        }

        if (projectPatch.Model.NeedleIds != null)
            needleIds = projectPatch.Model.NeedleIds;

        var projectModel = _mapper.Map<ProjectModel>(project);

        var yarnOpToRemove = projectPatch.Operations.Where(x => x.path.Contains("yarnIds")).ToList();

        if (yarnOpToRemove != null)
        {
            foreach (var op in yarnOpToRemove)
                projectPatch.Operations.Remove(op);
            
            projectPatch.Model.YarnIds = null;
        }

        var needleOpToRemove = projectPatch.Operations.Where(x => x.path.Contains("needle")).ToList();

        if (needleOpToRemove != null)
        {
            foreach (var op in needleOpToRemove)
                projectPatch.Operations.Remove(op);

            projectPatch.Model.NeedleIds = null;
        }

        projectPatch.ApplyToT(projectModel);

        var projectMap = _mapper.Map<ProjectEntity>(projectModel);
        projectMap.YarnIds = yarnIds;
        projectMap.ProjectInventoryIds = yarnInventory;
        projectMap.UserId = tokenResult.UserId;
        projectMap.NeedleIds = needleIds;

        _context.Entry<ProjectEntity>(project).CurrentValues.SetValues(projectMap);

        _context.SaveChanges();

        if (projectPatch.Model.Status == Enums.ProjectStatus.Completed)
            CompleteProject(userToken, projectId);

        var updatedEntity = _context.Projects.Where(p => p.ProjectId == projectId && p.UserId == tokenResult.UserId);
        return true;
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

    private IEnumerable<YarnInventoryDto> GetYarnsForProject(string userToken, IEnumerable<Guid>? yarnIds, Guid projectId)
    {
        var yarns = _inventoryService.GetYarns(userToken, yarnIds);
        var returnYarns = new List<YarnInventoryDto>();

        foreach (var yarn in yarns)
        {
            yarn.InUse = _projectYarnService.GetNumInUseByProject(yarn.ItemId, projectId, userToken);
            returnYarns.Add(yarn);

        }
        return returnYarns;
    }
}

