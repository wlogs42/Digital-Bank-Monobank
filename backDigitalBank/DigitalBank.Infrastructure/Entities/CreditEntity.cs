namespace DigitalBank.Infrastructure.Entities;

public class CreditEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CardId { get; set; }
    public decimal PrincipalAmount { get; set; }
    public DateOnly DueDate { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? RepaidAtUtc { get; set; }
}
