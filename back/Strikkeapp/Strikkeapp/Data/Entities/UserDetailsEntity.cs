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
    [CustomValidation(typeof(UserDetails), nameof(ValidateUserType))]
    public string UserType { get; set; } = "user";

    // Validation for user type
    private static ValidationResult ValidateUserType(string userType)
    {
        var validTypes = new List<string> { "admin", "user" };
        if (validTypes.Contains(userType))
        {
            return ValidationResult.Success!;
        }
        return new ValidationResult("Invalid type");
    }
}