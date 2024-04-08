namespace Strikkeapp.Models;

public class AddNeedleRequest
{
    public string userToken {  get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Size { get; set; }
    public int Length { get; set; }

    public bool isOk()
    {
        // Make sure length and size is bigger than 0 and type is not empty
        return(!string.IsNullOrWhiteSpace(Type) &&
            !string.IsNullOrWhiteSpace(userToken) &&
            !(Size < 0) && !(Length < 0));
    }
}


public class AddYarnRequest
{
    public string userToken { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string? Batch_Number { get; set; }
    public int? Weight { get; set; }
    public int? Length { get; set; }
    public string? Gauge { get; set; }
    public string? Notes { get; set; }

    public bool isOk()
    {
        return (!string.IsNullOrWhiteSpace(userToken) &&
            !string.IsNullOrWhiteSpace(Type) &&
            !string.IsNullOrWhiteSpace(Manufacturer) &&
            !string.IsNullOrWhiteSpace(Color));
    }
}