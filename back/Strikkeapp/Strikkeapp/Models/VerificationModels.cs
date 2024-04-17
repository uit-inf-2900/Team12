namespace Strikkeapp.Models;

public class VerificationCreationResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static VerificationCreationResult ForSuccess() => new VerificationCreationResult
    {
        Success = true,
    };

    public static VerificationCreationResult ForFailure(string message) => new VerificationCreationResult
    {
        Success = false,
        ErrorMessage = message
    };
}