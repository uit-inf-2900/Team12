using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class YarnInventory
{
    [Key]
    public Guid ItemID { get; set; } = Guid.NewGuid();

    [Required]
    [ForeignKey("UserLogIn")]
    public Guid UserId { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Manufacturer { get; set; } = string.Empty;

    [Required]
    public int Weight { get; set; }

    [Required]
    public int Length { get; set; }

    [Required]
    public string Gauge { get; set; } = string.Empty;

    [Required]
    public int NumItems { get; set; }

    [Required]
    public int InUse { get; set; }

    public string? Notes { get; set; }
}