namespace Strikkeapp.Data.Dto; 

public class ContactRequestDto
{
    public Guid ContactRequestId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string UserMessage { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public bool IsActive { get; set; } 
}