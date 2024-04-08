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
