namespace Strikkeapp.Models;

public class VerificationResultCreate
{
    public bool Success { get; set; }
    public string Code { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;

    public static VerificationResultCreate ForSuccess(string c) => new VerificationResultCreate
    {
        Success = true,
        Code = c
    };

    public static VerificationResultCreate ForFailure(string message) => new VerificationResultCreate
    {
        Success = false,
        ErrorMessage = message
    };
}

public class VerificationResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static VerificationResult ForSuccess() => new VerificationResult
    {
        Success = true
    };

    public static VerificationResult ForFailure(string message) => new VerificationResult
    {
        Success = false,
        ErrorMessage = message
    };

}

public class VerificationRequest
{
    public string UserToken { get; set; } = string.Empty;
    public string VerificationCode { get; set; } = string.Empty;

    public bool IsOk()
    {
        return !string.IsNullOrWhiteSpace(UserToken)
            && VerificationCode.Length == 6;
    }
}