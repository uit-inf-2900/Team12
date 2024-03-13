namespace Strikkeapp.Models;

public class UserInfoServiceResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string UserFullName { get; set; } = string.Empty;

    public static UserInfoServiceResult ForSuccess(string userEmail, string userFullName) => new UserInfoServiceResult
    {
        Success = true,
        UserEmail = userEmail,
        UserFullName = userFullName
    };
    public static UserInfoServiceResult ForFailure(string message) => new UserInfoServiceResult
    {
        Success = false,
        ErrorMessage = message
    };
}