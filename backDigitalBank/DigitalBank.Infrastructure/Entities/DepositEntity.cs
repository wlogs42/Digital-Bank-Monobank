using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Infrastructure.Entities;

public class DepositEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CardId { get; set; }
    public decimal PrincipalAmount { get; set; }
    public Currency Currency { get; set; }
    public int TermDays { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? WithdrawnAtUtc { get; set; }
}
