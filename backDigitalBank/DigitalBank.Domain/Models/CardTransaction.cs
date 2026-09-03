using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Domain.Models;

public class CardTransaction
{
    private CardTransaction(
        int id,
        int fromCardId,
        int toCardId,
        decimal amount,
        Currency currency,
        DateTime createdAtUtc)
    {
        Id = id;
        FromCardId = fromCardId;
        ToCardId = toCardId;
        Amount = amount;
        Currency = currency;
        CreatedAtUtc = createdAtUtc;
    }

    public int Id { get; }
    public int FromCardId { get; }
    public int ToCardId { get; }
    public decimal Amount { get; }
    public Currency Currency { get; }
    public DateTime CreatedAtUtc { get; }

    public static (CardTransaction? Transaction, string Error) Create(
        int id,
        int fromCardId,
        int toCardId,
        decimal amount,
        Currency currency,
        DateTime createdAtUtc)
    {
        if (fromCardId == toCardId)
            return (null, "Can't transfer to the same card.");

        if (amount <= 0)
            return (null, "Transfer amount must be greater than zero.");

        var transaction = new CardTransaction(id, fromCardId, toCardId, amount, currency, createdAtUtc);
        return (transaction, string.Empty);
    }
}
