using static Strikkeapp.Services.RecipeService;
using Microsoft.EntityFrameworkCore;

using Strikkeapp.Data.Models;

namespace Strikkeapp.Services;

public interface IRecipeService
{
    public RecipeServiceResult StoreRecipe(Stream fileStream, string jwtToken, string recipeName, int needleSize, string knittingGauge);
}

public class RecipeService : IRecipeService
{
    private readonly TokenService _tokenService;
    private readonly string _storagePath;
    private readonly StrikkeappDbContext _context;

    
    public RecipeService(IConfiguration configuration, TokenService tokenService, StrikkeappDbContext context)
    {
        _storagePath = configuration.GetConnectionString("RecipesStorage")!;
        _tokenService = tokenService;
        _context = context;
    }

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

    public RecipeServiceResult StoreRecipe(Stream fileStream, string jwtToken, string recipeName, int needleSize, string knittingGauge)
    {
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if(tokenResult.Success == false)
        {
            return RecipeServiceResult.ForFailure(tokenResult.ErrorMessage);
        }

        try
        {
            var knittingRes = new KnittingRecipes
            {
                UserId = tokenResult.UserId,
                RecipeName = recipeName,
                NeedleSize = needleSize,
                KnittingGauge = knittingGauge
            };

            var fileName = $"{knittingRes.KnittingRecipeId}.pdf";
            var filePath = Path.Combine(_storagePath, fileName);
            Directory.CreateDirectory(_storagePath);

            using(var file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
            {
                fileStream.CopyTo(file);
            }

            knittingRes.RecipePath = filePath;

            _context.KnittingRecipes.Add(knittingRes);
            _context.SaveChanges();

            return RecipeServiceResult.ForSuccess(filePath);
        }

        catch (Exception ex)
        {
            return RecipeServiceResult.ForFailure(ex.Message);
        }
    }

}