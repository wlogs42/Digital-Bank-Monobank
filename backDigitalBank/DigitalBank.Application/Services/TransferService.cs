using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Services;

public class TransferService
{
    private readonly ICardRepository _cardRepository;
    private readonly ICardTransactionRepository _transactionRepository;

    public TransferService(ICardRepository cardRepository, ICardTransactionRepository transactionRepository)
    {
        _cardRepository = cardRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<(CardTransaction? Transaction, string Error)> TransferAsync(
        int fromCardId,
        string toCardNumber,
        decimal amount,
        CancellationToken cancellationToken = default)
    {
        if (amount <= 0)
            return (null, "Transfer amount must be greater than zero.");

        var fromCard = await _cardRepository.GetByIdAsync(fromCardId, cancellationToken);
        if (fromCard is null)
            return (null, "Sender card not found.");

        var toCard = await _cardRepository.GetByCardNumberAsync(toCardNumber, cancellationToken);
        if (toCard is null)
            return (null, "Recipient card not found.");

        if (fromCard.Id == toCard.Id)
            return (null, "Can't transfer to the same card.");

        if (fromCard.Balance.Currency != toCard.Balance.Currency)
            return (null, "Sender and recipient cards use different currencies.");

        if (fromCard.Balance.Amount < amount)
            return (null, "Insufficient funds.");

        return await _transactionRepository.TransferAsync(
            fromCard.Id, toCard.Id, amount, fromCard.Balance.Currency, cancellationToken);
    }
}
