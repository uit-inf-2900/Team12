namespace Strikkeapp.Recipes.Models;

public class RecipeInfo
{
    private string? _notes { get; set; }
    public Guid RecipeId { get; set; }
    public string RecipeName { get; set; } = string.Empty;
    public int NeedleSize { get; set; }
    public string KnittingGauge { get; set; } = string.Empty;
    public string? Notes
    {
        get
        {
            if (_notes == null)
                return string.Empty;
            return _notes;
        }

        set
        {
            if (value == null)
                _notes = string.Empty;
            else
                _notes = value;
        }
    }

}

public class RecipePatch
{
    public string? RecipeName { get; set; }
    public int? NeedleSize { get; set; }
    public string? KnittingGauge { get; set; }
    public string? Notes { get; set; }
}