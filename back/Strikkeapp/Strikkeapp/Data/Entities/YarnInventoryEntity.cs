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
    public string Type { get; set; } = string.Empty;

    [Required]
    public string Manufacturer { get; set; } = string.Empty;

    [Required]
    public string Color { get; set; } = string.Empty;

    public string? Batch_Number { get; set; }

    public int? Weight { get; set; }

    public int? Length { get; set; }

    public string? Gauge { get; set; }

    [Required]
    public int NumItems { get; set; }

    [Required]
    public int InUse { get; set; }

    public string? Notes { get; set; }
}