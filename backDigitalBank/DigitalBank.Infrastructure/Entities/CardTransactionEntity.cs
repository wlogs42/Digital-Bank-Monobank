using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Infrastructure.Entities;

public class CardTransactionEntity
{
    public int Id { get; set; }
    public int FromCardId { get; set; }
    public int ToCardId { get; set; }
    public decimal Amount { get; set; }
    public Currency Currency { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
