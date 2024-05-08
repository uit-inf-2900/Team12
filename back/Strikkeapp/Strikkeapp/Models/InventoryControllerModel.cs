﻿namespace Strikkeapp.Models;

public class AddNeedleRequest
{
    public string UserToken {  get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Size { get; set; }
    public int Length { get; set; }
    public int? NumItem { get; set; }

    public bool isOk()
    {
        return!string.IsNullOrWhiteSpace(Type) &&
            !string.IsNullOrWhiteSpace(UserToken) &&
            !(Size < 0) && !(Length < 0);
    }
}

public class AddYarnRequest
{
    public string UserToken { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string? Batch_Number { get; set; }
    public int? Weight { get; set; }
    public int? Length { get; set; }
    public string? Gauge { get; set; }
    public string? Notes { get; set; }
    public int? NumItem { get; set; }

    public bool isOk()
    {
        return !string.IsNullOrWhiteSpace(UserToken) &&
            !string.IsNullOrWhiteSpace(Type) &&
            !string.IsNullOrWhiteSpace(Manufacturer) &&
            !string.IsNullOrWhiteSpace(Color);
    }
}

public class UpdateItemRequest
{
    public string UserToken { get; set; } = string.Empty;
    public Guid ItemId { get; set; } = Guid.Empty;
    public int NewNum { get; set; }

    public bool isOk()
    {
        return !string.IsNullOrWhiteSpace(UserToken) &&
            !(ItemId == Guid.Empty) &&
            !(NewNum < 0);

    }
}

public class UpdateYarnRequest
{
    public string UserToken { get; set; } = string.Empty;
    public Guid ItemId { get; set; } = Guid.Empty;
    public int NewNum { get; set; }
    public int NumItems { get; set; }
    public string? Type { get; set; }
    public string? Manufacturer { get; set; }
    public string? Color { get; set; }
    public string? Batch_Number { get; set; }
    public int? Weight { get; set; }
    public int? Length { get; set; }
    public string? Gauge { get; set; }
    public string? Notes { get; set; }


    public bool isOk()
    {
        return !string.IsNullOrWhiteSpace(UserToken) &&
            !(ItemId == Guid.Empty);
    }

}
    

public class DeleteItemRequest
{
    public string UserToken { get; set; } = string.Empty;
    public Guid ItemId { get; set; } = Guid.Empty;

    public bool isOk()
    {
        return !string.IsNullOrWhiteSpace(UserToken) &&
            !(ItemId == Guid.Empty);
    }
}