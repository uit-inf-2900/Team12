namespace Strikkeapp.Models;

public class TokenResult
{
    public bool Success { get; set; }
    public Guid UserId { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static TokenResult ForSuccess(Guid userId) => new TokenResult
    {
        Success = true,
        UserId = userId
    };
    public static TokenResult ForFailure(string message) => new TokenResult
    {
        Success = false,
        ErrorMessage = message
    };
}
