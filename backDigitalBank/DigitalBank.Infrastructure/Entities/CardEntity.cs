using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Infrastructure.Entities;

public class CardEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string CardNumber { get; set; } = string.Empty;
    public string ExpirationDate { get; set; } = string.Empty;
    public string SecurityCode { get; set; } = string.Empty;
    public string CardType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public decimal BalanceAmount { get; set; }
    public Currency BalanceCurrency { get; set; }
}
