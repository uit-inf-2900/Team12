using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class Counter
{
    [Key]
    public Guid CounterId { get; } = Guid.NewGuid();

    [ForeignKey("UserLogIn")]
    public Guid UserId { get; set; }

    [Required]
    public int RoundNumber { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;
}
