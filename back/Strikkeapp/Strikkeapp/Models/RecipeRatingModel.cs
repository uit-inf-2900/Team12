using Strikkeapp.Enums;

namespace Strikkeapp.Models;

public class RecipeRatingModel
{
    public Guid? RecipeRatingId { get; set; }
    public Guid RecipeId { get; set; }
    public Rating Rating { get; set; } = Rating.None;
}