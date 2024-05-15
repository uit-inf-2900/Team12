using Strikkeapp.Recipes.Models;

namespace Strikkeapp.Tests.UnitTests;


public class RecipePatchTests()
{
    [Fact]
    public void RecipePatchNotes_Null()
    {
        // Arrange
        RecipeInfo recipeInfo = new RecipeInfo
        {
            RecipeName = string.Empty,
            NeedleSize = 0,
            KnittingGauge = string.Empty,
            Notes = null
        };

        // Act and check assertion
        var result = recipeInfo;
        Assert.Equal(string.Empty, result.Notes);
    }

}

