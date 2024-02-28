using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Strikkeapp.Data.Models
{
    public class UserLogIn
    {
        // Define UserLogIn schema
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
        public static ValidationResult ValidateUserStatus(string userStatus, ValidationContext context)
        {
            var validStatuses = new List<string> { "unverified", "verified", "banned", "inactive" };
            if (validStatuses.Contains(userStatus))
            {
                return ValidationResult.Success!;
            }
            return new ValidationResult("Invalid status");
        }
    }

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
        public static ValidationResult ValidateUserType(string userType, ValidationContext context)
        {
            var validTypes = new List<string> { "admin", "user" };
            if (validTypes.Contains(userType))
            {
                return ValidationResult.Success!;
            }
            return new ValidationResult("Invalid type");
        }
    }

    public class KnittingRecipes
    {
        [Key]
       
        public Guid KnittingRecipeId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("UserLogIn")]
        public Guid UserId { get; set;}

        [Required]
        public byte[]? RecipePDF { get; set;}
    }
}
