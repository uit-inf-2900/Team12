namespace Strikkeapp.Models;

public class VerificationResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static VerificationResult ForSuccess() => new VerificationResult
    {
        Success = true,
    };

    public static VerificationResult ForFailure(string message) => new VerificationResult
    {
        Success = false,
        ErrorMessage = message
    };
}