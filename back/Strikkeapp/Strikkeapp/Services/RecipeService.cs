using static Strikkeapp.Services.RecipeService;
using Microsoft.EntityFrameworkCore;

using Strikkeapp.Data.Models;
using Strikkeapp.Recipes.Models;

namespace Strikkeapp.Services;

public interface IRecipeService
{
    public RecipeServiceResult StoreRecipe(Stream fileStream, string jwtToken, string recipeName, int needleSize, string knittingGauge);
    public RecipeServiceResultGet GetRecipes(string userToken);
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

    public RecipeServiceResultGet GetRecipes(string userToken)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            return RecipeServiceResultGet.ForFailure(tokenResult.ErrorMessage);
        }

        try
        {
            var recipes = _context.KnittingRecipes
                .Where(r => r.UserId == tokenResult.UserId)
                .Select(r => new RecipeInfo
                {
                    RecipeId = r.KnittingRecipeId,
                    RecipeName = r.RecipeName,
                })
                .ToList();

            return RecipeServiceResultGet.ForSuccess(recipes);
        }

        catch (Exception ex)
        {
            return RecipeServiceResultGet.ForFailure(ex.Message);
        }
    }
}