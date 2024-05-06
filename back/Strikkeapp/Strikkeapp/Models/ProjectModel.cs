using System;
using Strikkeapp.Enums;

namespace Strikkeapp.Models;

public class ProjectModel
{
	public Guid ProjectId { get; set; }
    public Guid? RecipeId { get; set; }
    public ProjectStatus Status { get; set; }
    public IEnumerable<NeedleInventoryDto>? Needles { get; set; }
    public IEnumerable<YarnInventoryDto>? Yarns { get; set; }
    public string? Notes { get; set; }
}

public class ProjectCreateModel
{
    public Guid? RecipeId { get; set; }
    public ProjectStatus Status { get; set; }
    public List<Guid>? NeedleIds { get; set; }
    public List<Guid>? YarnIds { get; set; }
    public string? Notes { get; set; }
}