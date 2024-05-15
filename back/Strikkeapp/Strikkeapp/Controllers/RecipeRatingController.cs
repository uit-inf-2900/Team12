using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Enums;
using Strikkeapp.Models;
using Strikkeapp.Services;

namespace Strikkeapp.Controllers;

[ApiController]
[Route("api/rating")]
public class RecipeRatingController
{
    private readonly IRecipeRatingService _recipeRatingService;
    private readonly ITokenService _tokenService;

    public RecipeRatingController(IRecipeRatingService recipeRatingService, ITokenService tokenService)
    {
        _recipeRatingService = recipeRatingService;
        _tokenService = tokenService;
    }

    [HttpPost("{recipeId:guid}")]
    public RecipeRatingModel RateRecipe(Guid recipeId, Rating rating, string userToken)
    {
        // authenticate user
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
            throw new UnauthorizedAccessException();

        // rate recipe
        var result = _recipeRatingService.PostRating(recipeId, rating, tokenResult.UserId);

        return result;
    }

    [HttpGet("{recipeId:guid}")]
    public RecipeRatingModel GetRating(Guid recipeId, string userToken)
    {
        // authenticate user
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
            throw new UnauthorizedAccessException();

        // get rating
        var result = _recipeRatingService.GetRating(recipeId, tokenResult.UserId);

        return result;
    }

}