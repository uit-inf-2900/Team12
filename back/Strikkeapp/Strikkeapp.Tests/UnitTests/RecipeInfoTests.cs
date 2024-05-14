using Strikkeapp.Recipes.Models;

namespace Strikkeapp.Tests.UnitTests;

public class RecipeInfoTests()
{
    [Fact]
    public void RecipeInfoNotes_Null()
    {
        // Arrange
        RecipeInfo recipeInfo = new RecipeInfo
        {
            Notes = null
        };

        // Act and check assertion
        var result = recipeInfo.Notes;
        Assert.Equal(string.Empty, result);
    }
}