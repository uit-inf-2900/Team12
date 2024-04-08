using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;
public class KnittingRecipes
{
    [Key]
    public Guid KnittingRecipeId { get; set; } = Guid.NewGuid();

    [Required]
    [ForeignKey("UserLogIn")]
    public Guid UserId { get; set; }

    [Required]
    public string RecipeName { get; set; } = string.Empty;

    [Required]
    public int NeedleSize { get; set; }

    [Required]
    public string KnittingGauge { get; set; } = string.Empty;

    [Required]
    public string? RecipePath { get; set; }
}