namespace DigitalBank.Infrastructure.Entities;

public class PiggyBankEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
