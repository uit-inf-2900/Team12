namespace Strikkeapp.User.Models;

public class UserServiceResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }

    public static UserServiceResult ForSuccess(string token, bool isAdmin) => new UserServiceResult
    {
        Success = true,
        Token = token,
        IsAdmin = isAdmin
    };
    public static UserServiceResult ForFailure(string message) => new UserServiceResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class DeleteUserResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static DeleteUserResult ForSuccess() => new DeleteUserResult
    {
        Success = true
    };

    public static DeleteUserResult ForFailure(string message) => new DeleteUserResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class UpdateAdminResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public Guid UpdatedUser { get; set; }

    public static UpdateAdminResult ForSuccess(Guid updatedUser, bool isAdmin) => new UpdateAdminResult
    {
        Success = true,
        UpdatedUser = updatedUser,
        IsAdmin = isAdmin
    };

    public static UpdateAdminResult ForFailure(string message) => new UpdateAdminResult
    {
        Success = false,
        ErrorMessage = message
    };
}