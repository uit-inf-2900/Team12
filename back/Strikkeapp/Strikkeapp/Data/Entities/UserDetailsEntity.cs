using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class UserDetails
{
    // Define UserDetails schema
    [Key]
    [ForeignKey("UserLogIn")]
    public Guid UserId { get; set; }

    [Required]
    public string UserFullName { get; set; } = string.Empty;

    [Required]
    // Consider using DateTime type
    public DateTime DateOfBirth { get; set; }

    [Required]
    public bool IsAdmin { get; set; } = false;
}