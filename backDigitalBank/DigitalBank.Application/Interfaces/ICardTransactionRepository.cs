using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Application.Interfaces;

public interface ICardTransactionRepository
{
    Task<(CardTransaction? Transaction, string Error)> TransferAsync(
        int fromCardId,
        int toCardId,
        decimal amount,
        Currency currency,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CardTransaction>> GetByCardIdAsync(int cardId, CancellationToken cancellationToken = default);
}
