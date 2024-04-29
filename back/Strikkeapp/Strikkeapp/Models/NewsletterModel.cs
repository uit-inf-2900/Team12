namespace Strikkeapp.Models;

public class NewsletterResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static NewsletterResult ForSuccess() => new NewsletterResult
    { Success = true };

    public static NewsletterResult ForFailure(string message) => new NewsletterResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class NewsletterSubscribersResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public List<string> Subscribers { get; set; } = new List<string>();

    public static NewsletterSubscribersResult ForSuccess(List<string> subscribers) => new NewsletterSubscribersResult
    {
        Success = true,
        Subscribers = subscribers
    };

    public static NewsletterSubscribersResult ForFailure(string message) => new NewsletterSubscribersResult
    {
        Success = false,
        ErrorMessage = message
    };
}