using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class ProjectTracking
{
    [Key]
    public Guid ProjectId { get; set; } = Guid.NewGuid();

    [ForeignKey("KnittingRecipes")]
    public Guid? KnittingRecipeId { get; set; }

    [ForeignKey("UserLogIn")]
    public Guid UserId { get; set; }

    public string? ProsjectSize { get; set; }

    public string? ProjectRecipient {  get; set; }

    [Required]
    [CustomValidation(typeof(ProjectTracking), nameof(ValidateProjectStatus))]
    public string ProjectStatus { get; set; } = "planned";

    public DateTime? ProjectStart {  get; set; }

    public DateTime? ProjectEnd { get; set; }

    public string? ProjectNotes { get; set; }

    public string? ProjectImagePath { get; set; }

    private static ValidationResult ValidateProjectStatus(string projectStatus)
    {
        var validStatuses = new List<string> { "planned", "active", "finished" };
        if(validStatuses.Contains(projectStatus))
        {
            return ValidationResult.Success!;
        }

        return new ValidationResult("Invalid Status");
    }
}
