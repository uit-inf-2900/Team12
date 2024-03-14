using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class UserLogIn
{
    [Key]
    public Guid UserId { get; set; } = Guid.NewGuid();

    [Required]
    [EmailAddress]
    public string UserEmail { get; set; } = string.Empty;

    [Required]
    public string UserPwd { get; set; } = string.Empty;

    [Required]
    [CustomValidation(typeof(UserLogIn), nameof(ValidateUserStatus))]
    public string UserStatus { get; set; } = "unverified";

    // Validation for user status
    private static ValidationResult ValidateUserStatus(string userStatus)
    {
        var validStatuses = new List<string> { "unverified", "verified", "banned", "inactive" };
        if (validStatuses.Contains(userStatus))
        {
            return ValidationResult.Success!;
        }
        return new ValidationResult("Invalid status");
    }
}