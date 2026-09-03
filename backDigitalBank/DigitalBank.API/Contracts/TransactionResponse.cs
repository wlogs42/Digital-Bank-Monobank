using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.API.Contracts;

public record TransactionResponse(
    int Id,
    int FromCardId,
    int ToCardId,
    decimal Amount,
    Currency Currency,
    DateTime CreatedAtUtc)
{
    public static TransactionResponse FromDomain(CardTransaction transaction) => new(
        transaction.Id, transaction.FromCardId, transaction.ToCardId,
        transaction.Amount, transaction.Currency, transaction.CreatedAtUtc);
}
