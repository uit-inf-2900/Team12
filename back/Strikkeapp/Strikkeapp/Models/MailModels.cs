namespace Strikkeapp.Models;

public class MailResult
{
    public bool Succes { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static MailResult ForSuccess() => new MailResult
    {
        Succes = true
    };

    public static MailResult ForFailure(string message) => new MailResult
    {
        Succes = false,
        ErrorMessage = message
    };
}
