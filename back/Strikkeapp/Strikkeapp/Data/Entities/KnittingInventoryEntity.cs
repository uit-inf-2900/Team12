using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class KnittingInventory
{
    [Key]
    public Guid ItemID { get; set; } = Guid.NewGuid();

    [Required]
    [ForeignKey("UserLogIn")]
    public Guid UserId { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public int Size { get; set; }

    [Required]
    public int Length { get; set; }

    [Required]
    public int NumItem { get; set; }

    [Required]
    public int NumInUse { get; set; }
}