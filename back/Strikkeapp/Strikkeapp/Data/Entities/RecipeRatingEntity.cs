using Strikkeapp.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Strikkeapp.Data.Entities;

public class RecipeRatingEntity
{
    [Key]
    public Guid RecipeRatingId { get; set; } = Guid.NewGuid();
    public Guid? RecipeId { get; set; }
    public Rating? Rating { get; set; }
    [Required]
    [ForeignKey("UserLogIn")]
    public Guid? UserId { get; set; }
}