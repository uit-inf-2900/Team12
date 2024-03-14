using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class ContactRequest
{
    // Get -> verdien du får, set-> verdien du setter 
    // bruker bare get om du vil gjøre den imuteble (ikke mulig å endre) 
    [Key]
    public Guid ContactRequestId { get; set; } = Guid.NewGuid();

    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Message { get; set; }

    public DateTime TimeCreated { get; set; } = DateTime.Now;

    public bool IsActive { get; set; } = false;

    public bool IsHandled { get; set; } = false;
}