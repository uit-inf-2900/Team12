using System;
using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Controllers;


[Route("api/projects")]
[ApiController]
public class ProjectController
{
	private readonly IProjectService _projectService;
	public ProjectController(IProjectService projectService)
	{
		_projectService = projectService;
	}


	[HttpGet]
	public List<ProjectModel> GetProjects([FromQuery] string userToken)
	{
		var projects = _projectService.GetProjects(userToken);
		return projects;
	}

	[HttpPost]
    public bool PostProject([FromQuery] string userToken, [FromBody] ProjectCreateModel projectModel)
	{
		var result = _projectService.CreateProject(userToken, projectModel);
		return result;
	}

	[HttpPost("complete")]
	public bool CompleteProject([FromQuery] string userToken, [FromQuery] Guid projectId)
	{
		var result = _projectService.CompleteProject(userToken, projectId);
		return result;
	}


    [HttpDelete]
	public bool DeleteProject([FromQuery] string userToken, [FromQuery] Guid projectId)
	{
		var result = _projectService.DeleteProject(projectId, userToken);
		return result;
	}  
}
