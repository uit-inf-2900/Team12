using Strikkeapp.Data.Entities;

namespace Strikkeapp.Models;

public class InventoryResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public List<YarnInventoryDto> YarnInventories { get; set; } = new List<YarnInventoryDto>();
    public List<NeedleInventoryDto> NeedleInventories { get; set; } = new List<NeedleInventoryDto>();

    public static InventoryResult ForSuccess(List<YarnInventoryDto> yarnInventories, List<NeedleInventoryDto> needleInventories) => new InventoryResult
    {
        Success = true,
        YarnInventories = yarnInventories,
        NeedleInventories = needleInventories
    };

    public static InventoryResult ForFailure(string message) => new InventoryResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class YarnInventoryDto
{
    public Guid ItemId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public int Weight { get; set; }
    public int Length { get; set; }
    public string Gauge { get; set; } = string.Empty;
    public int NumItems { get; set; }
    public int InUse { get; set; }
    public string? Notes { get; set; }
}

public class NeedleInventoryDto
{
    public Guid ItemId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Size { get; set; }
    public int Length { get; set; }
    public int NumItem { get; set; }
    public int NumInUse { get; set; }
}
