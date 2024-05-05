namespace Strikkeapp.Models;

public class MailResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static MailResult ForSuccess() => new MailResult
    {
        Success = true
    };

    public static MailResult ForFailure(string message) => new MailResult
    {
        Success = false,
        ErrorMessage = message
    };
}
