﻿using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Services;

namespace strikkeapp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly IRecipeService _recipeService;
    public RecipeController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    public class FormData
    {
        public string UserToken { get; set; } = string.Empty;
        public string RecipeName { get; set; } = string.Empty;
        public int NeedleSize {  get; set; }
        public string KnittingGauge { get; set; } = string.Empty;
        public IFormFile? RecipeFile { get; set; }

        // Check that request is ok
        public bool requestOk()
        {
            return( !string.IsNullOrWhiteSpace(UserToken) &&
                    !string.IsNullOrWhiteSpace(RecipeName) &&
                    !string.IsNullOrWhiteSpace(KnittingGauge) &&
                    NeedleSize > 0 &&
                    RecipeFile != null);
        }

    }


    [HttpPost]
    [Route("/upload")]
    public IActionResult UploadRecipe([FromForm] FormData formData)
    {
        if(!formData.requestOk() || formData.RecipeFile == null)
        {
            return BadRequest("Invalid request");
        }

        using var stream = formData.RecipeFile.OpenReadStream();
        var result = _recipeService.StoreRecipe(stream, formData.UserToken, 
            formData.RecipeName, formData.NeedleSize, formData.KnittingGauge);

        if (!result.Success)
        {
            return StatusCode(422, result.ErrorMesssage);
        }

        return Created(result.Path, "Recipe uploaded successfully");
    }
        
}


