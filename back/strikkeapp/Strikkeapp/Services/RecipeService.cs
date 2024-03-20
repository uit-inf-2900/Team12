using Microsoft.EntityFrameworkCore;

using Strikkeapp.Data.Entities;
using Strikkeapp.Data.Context;
using Strikkeapp.Recipes.Models;

namespace Strikkeapp.Services;

public interface IRecipeService
{
    public RecipeServiceResult StoreRecipe(Stream fileStream, string jwtToken, string recipeName, int needleSize, string knittingGauge);
    public RecipeServiceResultGet GetRecipes(string userToken);
    public RecipePDFResult GetRecipePDF(Guid recipeId, string userToken);
}

public class RecipeService : IRecipeService
{
    private readonly ITokenService _tokenService;
    private readonly string _storagePath;
    private readonly StrikkeappDbContext _context;

    
    public RecipeService(IConfiguration configuration, ITokenService tokenService, StrikkeappDbContext context)
    {
        _storagePath = configuration.GetConnectionString("RecipesStorage")!;
        _tokenService = tokenService;
        _context = context;
    }

    public RecipeServiceResult StoreRecipe(Stream fileStream, string jwtToken, string recipeName, int needleSize, string knittingGauge)
    {
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(jwtToken);
        if(tokenResult.Success == false)
        {
            return RecipeServiceResult.ForFailure(tokenResult.ErrorMessage);
        }

        try
        {
            // Create new recipe
            var knittingRes = new KnittingRecipes
            {
                UserId = tokenResult.UserId,
                RecipeName = recipeName,
                NeedleSize = needleSize,
                KnittingGauge = knittingGauge
            };

            // Save recipe to file
            var fileName = $"{knittingRes.KnittingRecipeId}.pdf";
            var filePath = Path.Combine(_storagePath, fileName);
            Directory.CreateDirectory(_storagePath);

            // Copy file to storage
            using(var file = new FileStream(filePath, FileMode.Create, FileAccess.Write))
            {
                fileStream.CopyTo(file);
            }

            // Save path to recipe
            knittingRes.RecipePath = filePath;

            // Save recipe to database
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
        // Get and check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (tokenResult.Success == false)
        {
            return RecipeServiceResultGet.ForFailure(tokenResult.ErrorMessage);
        }

        try
        {
            // Gett all recipes for user
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

    public RecipePDFResult GetRecipePDF(Guid recipeId, string userToken)
    {
        // Check token
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if(!tokenResult.Success)
        {
            return RecipePDFResult.ForFailure("Unauthorized");
        }

        try
        {   
            // Get recipe
            var recipe = _context.KnittingRecipes
                .FirstOrDefault(r => r.KnittingRecipeId == recipeId);

            // Check if recipe exists
            if(recipe == null)
            {
                return RecipePDFResult.ForFailure("Recipe not found");
            }

            // Check if user is authorized to get recipe
            if(recipe.UserId != tokenResult.UserId)
            {
                return RecipePDFResult.ForFailure("Unauthorized");
            }

            // Get recipe path and check if it exists
            var recipePath = recipe.RecipePath;
            if(recipePath == null)
            {
                return RecipePDFResult.ForFailure("Recipe not found");
            }

            var pdfData = File.ReadAllBytes(recipePath);

            return RecipePDFResult.ForSuccess(pdfData);

        }
        catch (Exception ex)
        {
            return RecipePDFResult.ForFailure(ex.Message);
        }
    }
        
}