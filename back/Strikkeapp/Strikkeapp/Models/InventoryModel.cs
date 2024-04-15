namespace Strikkeapp.Models;

public class InventoryGetResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public List<YarnInventoryDto> YarnInventories { get; set; } = new List<YarnInventoryDto>();
    public List<NeedleInventoryDto> NeedleInventories { get; set; } = new List<NeedleInventoryDto>();

    public static InventoryGetResult ForSuccess(List<YarnInventoryDto> yarnInventories, List<NeedleInventoryDto> needleInventories) => new InventoryGetResult
    {
        Success = true,
        YarnInventories = yarnInventories,
        NeedleInventories = needleInventories
    };

    public static InventoryGetResult ForFailure(string message) => new InventoryGetResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class YarnInventoryDto
{
    public Guid ItemId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string? Batch_Number { get; set; }
    public int? Weight { get; set; }
    public int? Length { get; set; }
    public string? Gauge { get; set; }
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

public class InventoryResult
{
    public bool Success { get; set; }
    public Guid ItemId { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static InventoryResult ForSuccess(Guid itemId) => new InventoryResult 
    { 
        Success = true,
        ItemId = itemId
    };

    public static InventoryResult ForFailure(string message) => new InventoryResult 
    { 
        Success = false,
        ErrorMessage = message
    };
}

public class UpdateInventoryResult
{
    public bool Success { get; set; }
    public Guid ItemId { get; set; }
    public int NewNum { get; set; }
    public int NewUsed { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static UpdateInventoryResult ForSuccessNum(Guid itemId, int newNum) => new UpdateInventoryResult
    {
        Success = true,
        ItemId = itemId,
        NewNum = newNum
    };

    public static UpdateInventoryResult ForSuccessUsed(Guid itemId, int newNum) => new UpdateInventoryResult
    {
        Success = true,
        ItemId = itemId,
        NewUsed = newNum
    };

    public static UpdateInventoryResult ForFailure(string message) => new UpdateInventoryResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class DeleteItemResult
{
    public bool Success { get; set; }
    public Guid ItemId { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static DeleteItemResult ForSuccess(Guid itemId) => new DeleteItemResult
    {
        Success = true,
        ItemId = itemId
    };

    public static DeleteItemResult ForFailure(string message) => new DeleteItemResult
    {
        Success = false,
        ErrorMessage = message
    };
}