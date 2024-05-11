namespace Strikkeapp.User.Models;

public class UserServiceResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public string UserStatus { get; set; } = string.Empty;

    public static UserServiceResult ForSuccess(string token, bool isAdmin, string userStauts) => new UserServiceResult
    {
        Success = true,
        Token = token,
        IsAdmin = isAdmin,
        UserStatus = userStauts
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

public class BanUserResult
{
    public bool Success { get; set; }
    public Guid BannedUser { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static BanUserResult ForSuccess(Guid bannedUser) => new BanUserResult
    {
        Success = true,
        BannedUser = bannedUser
    };

    public static BanUserResult ForFailure(string message) => new BanUserResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class GetUsersDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public Guid UserId { get; set; }
}

public class GetUsersResult
{
    public bool Success { get; set; }
    public List<GetUsersDto> Users { get; set; } = new List<GetUsersDto>();
    public string ErrorMessage { get; set; } = string.Empty;

    public static GetUsersResult ForSuccess(List<GetUsersDto> users) => new GetUsersResult
    {
        Success = true,
        Users = users
    };

    public static GetUsersResult ForFailure(string message) => new GetUsersResult
    {
        Success = false,
        ErrorMessage = message
    };
}

    