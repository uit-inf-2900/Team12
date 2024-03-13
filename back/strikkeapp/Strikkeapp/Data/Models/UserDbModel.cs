using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Strikkeapp.Data.Models
{
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

    public class KnittingRecipes
    {
        [Key]
        public Guid KnittingRecipeId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("UserLogIn")]
        public Guid UserId { get; set;}

        [Required]
        public string RecipeName { get; set; } = string.Empty;

        [Required]
        public int NeedleSize { get; set; }

        [Required]
        public string KnittingGauge {  get; set; } = string.Empty;

        [Required]
        public string? RecipePath { get; set;}
    }

    public class ContactRequest 
    {
        // Get -> verdien du får, set-> verdien du setter 
        // bruker bare get om du vil gjøre den imuteble (ikke mulig å endre) 
        [Key]
        public Guid ContactRequestId { get; set; } = Guid.NewGuid();

        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Message { get; set; }

        public DateTime TimeCreated { get; set; } = DateTime.Now;

        public bool IsActive { get; set; } = false;

        public bool IsHandled { get; set; } = false;
    }

}
