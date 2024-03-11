namespace Strikkeapp.Recipes.Models;

public class RecipeServiceResult
{
    public bool Success { get; set; }
    public string Path { get; set; } = string.Empty;
    public string ErrorMesssage { get; set; } = string.Empty;

    public static RecipeServiceResult ForSuccess(string RecipePath) => new RecipeServiceResult
    {
        Path = RecipePath,
        Success = true
    };

    public static RecipeServiceResult ForFailure(string message) => new RecipeServiceResult
    {
        Success = false,
        ErrorMesssage = message
    };
}

public class RecipeServiceResultGet
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public List<RecipeInfo> Recipes { get; set; } = new List<RecipeInfo>();

    public static RecipeServiceResultGet ForSuccess(List<RecipeInfo> recipes) => new RecipeServiceResultGet
    {
        Success = true,
        Recipes = recipes
    };

    public static RecipeServiceResultGet ForFailure(string message) => new RecipeServiceResultGet
    {
        Success = false,
        ErrorMessage = message
    };
}