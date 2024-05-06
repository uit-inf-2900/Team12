using Microsoft.AspNetCore.Mvc;
using Strikkeapp.Services;

namespace strikkeapp.Controllers;

[ApiController]
[Route("api/recipe")]
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
        public int NeedleSize { get; set; }
        public string KnittingGauge { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public IFormFile? RecipeFile { get; set; }

        // Check that request is ok
        public bool requestOk()
        {
            return (!string.IsNullOrWhiteSpace(UserToken) &&
                    !string.IsNullOrWhiteSpace(RecipeName) &&
                    !string.IsNullOrWhiteSpace(KnittingGauge) &&
                    NeedleSize > 0 &&
                    RecipeFile != null);
        }

    }


    [HttpPost]
    [Route("upload")]
    public IActionResult UploadRecipe([FromForm] FormData formData)
    {
        if (!formData.requestOk() || formData.RecipeFile == null)
        {
            return BadRequest("Invalid request");
        }

        using var stream = formData.RecipeFile.OpenReadStream();
        var result = _recipeService.StoreRecipe(stream, formData.UserToken,
            formData.RecipeName, formData.NeedleSize, formData.KnittingGauge, formData.Notes);

        if (!result.Success)
        {
            return StatusCode(422, result.ErrorMesssage);
        }

        return Created(result.Path, "Recipe uploaded successfully");
    }

    [HttpGet]
    [Route("getallrecipes")]
    public IActionResult GetRecipes([FromQuery] string userToken)
    {
        var result = _recipeService.GetRecipes(userToken);
        if (!result.Success)
        {
            return StatusCode(500, result.ErrorMessage);
        }

        return Ok(result.Recipes);
    }

    [HttpGet]
    [Route("recipe")]
    public IActionResult GetRecipePDF([FromQuery] string userToken, [FromQuery] Guid recipeId)
    {
        var result = _recipeService.GetRecipePDF(recipeId, userToken);
        if (!result.Success)
        {
            if (result.ErrorMessage == "Unauthorized")
            {
                return Unauthorized();
            }
            if (result.ErrorMessage == "Recipe not found")
            {
                return NotFound();
            }

            return StatusCode(500, result.ErrorMessage);
        }

        return File(result.PDFData, "application/pdf");
    }

    [HttpDelete]
    [Route("recipe")]
    public IActionResult DeleteRecipePDF([FromQuery] string userToken, Guid recipeId)
    {
        // Call the recipe service to delete the requested file
        var result = _recipeService.DeleteRecipePDF(recipeId, userToken);
        // if the file cannot be deleted, return 404 to indicate that the file does not exist, atleast in the scope of the user sending the request
        if (!result)
            return NotFound();

        // If delete is successful in the service, return 200 to indicate this
        return Ok();
    }


}


