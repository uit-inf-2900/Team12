namespace Strikkeapp.User.Models;

public class UserServiceResult
{
    public bool Success { get; set; }
    public Guid UserId { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;

    public static UserServiceResult ForSuccess(Guid userId, string token) => new UserServiceResult
    {
        Success = true,
        UserId = userId,
        Token = token
    };
    public static UserServiceResult ForFailure(string message) => new UserServiceResult
    {
        Success = false,
        ErrorMessage = message
    };
}