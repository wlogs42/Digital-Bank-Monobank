using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Services;

public class DepositService
{
    private readonly ICardRepository _cardRepository;
    private readonly IDepositRepository _depositRepository;

    public DepositService(ICardRepository cardRepository, IDepositRepository depositRepository)
    {
        _cardRepository = cardRepository;
        _depositRepository = depositRepository;
    }

    public async Task<(Deposit? Deposit, string Error)> OpenAsync(
        int userId,
        int cardId,
        decimal amount,
        int termDays,
        CancellationToken cancellationToken = default)
    {
        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != userId)
            return (null, "Card doesn't belong to this user.");

        var (validated, error) = Deposit.Create(0, userId, cardId, amount, card.Balance.Currency, termDays, DateTime.UtcNow);
        if (validated is null)
            return (null, error);

        return await _depositRepository.OpenAsync(
            userId, cardId, amount, card.Balance.Currency, termDays, DateTime.UtcNow, cancellationToken);
    }

    public async Task<(Deposit? Deposit, string Error)> WithdrawAsync(
        int depositId,
        int cardId,
        CancellationToken cancellationToken = default)
    {
        var deposit = await _depositRepository.GetByIdAsync(depositId, cancellationToken);
        if (deposit is null)
            return (null, "Deposit not found.");

        if (deposit.IsWithdrawn)
            return (null, "Deposit is already withdrawn.");

        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != deposit.UserId)
            return (null, "Card doesn't belong to this user.");

        var payoutAmount = deposit.GetPayoutAmount(DateTime.UtcNow);

        return await _depositRepository.WithdrawAsync(depositId, cardId, payoutAmount, DateTime.UtcNow, cancellationToken);
    }
}
