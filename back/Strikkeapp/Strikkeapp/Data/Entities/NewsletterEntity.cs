using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class Newsletter
{
    [Key]
    public string email { get; set; } = string.Empty;
}
