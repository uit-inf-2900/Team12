using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Strikkeapp.Enums;

namespace Strikkeapp.Data.Entities;

public class ProjectEntity
{
    [Key]
    public Guid ProjectId { get; set; } = Guid.NewGuid();
    public Guid? RecipeId { get; set; }
    public ProjectStatus Status { get; set; }
    public List<Guid>? NeedleIds { get; set; }
    public List<Guid>? YarnIds { get; set; }
    public List<Guid>? ProjectInventoryIds { get; set; }
    public string? Notes { get; set; }
    public Guid UserId { get; set; }
    public string? ProjectName { get; set; }
}

public class ProjectYarnInventoryEntity
{
    [Key]
    public Guid ProjectInventoryId { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public Guid ItemId { get; set; }
    public int NumberInUse { get; set; }
    public Guid UserId { get; set; }
}


