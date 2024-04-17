using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Strikkeapp.Data.Entities;

public class UserVerification
{
    [Key]
    [ForeignKey("UserLogIn")]
    public Guid UserId { get; set; }

    [Required]
    [StringLength(6)]
    public string VerificationCode { get; set; } = CreateCode();

    public static string CreateCode()
    {
        Random gen = new Random();
        string code = gen.Next(0, 999999).ToString("D6");

        return code;
    }
}
