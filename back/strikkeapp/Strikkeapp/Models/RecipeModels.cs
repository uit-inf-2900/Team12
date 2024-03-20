namespace Strikkeapp.Recipes.Models;

public class RecipeInfo
{
    public Guid RecipeId { get; set; }
    public string RecipeName { get; set; } = string.Empty;
    public string RecipePath { get; set; } = string.Empty;
}