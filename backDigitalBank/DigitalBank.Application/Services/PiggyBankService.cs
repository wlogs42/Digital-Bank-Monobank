using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Services;

public class PiggyBankService
{
    private readonly ICardRepository _cardRepository;
    private readonly IPiggyBankRepository _piggyBankRepository;

    public PiggyBankService(ICardRepository cardRepository, IPiggyBankRepository piggyBankRepository)
    {
        _cardRepository = cardRepository;
        _piggyBankRepository = piggyBankRepository;
    }

    public async Task<(PiggyBank? PiggyBank, string Error)> CreateAsync(
        int userId,
        string name,
        decimal targetAmount,
        CancellationToken cancellationToken = default)
    {
        var (validated, error) = PiggyBank.Create(0, userId, name, targetAmount, 0, DateTime.UtcNow);
        if (validated is null)
            return (null, error);

        var piggyBank = await _piggyBankRepository.CreateAsync(userId, name, targetAmount, DateTime.UtcNow, cancellationToken);
        return (piggyBank, string.Empty);
    }

    public async Task<(PiggyBank? PiggyBank, string Error)> DepositAsync(
        int userId,
        int piggyBankId,
        int cardId,
        decimal amount,
        CancellationToken cancellationToken = default)
    {
        if (amount <= 0)
            return (null, "Amount must be greater than zero.");

        var piggyBank = await _piggyBankRepository.GetByIdAsync(piggyBankId, cancellationToken);
        if (piggyBank is null)
            return (null, "Piggy bank not found.");

        if (piggyBank.UserId != userId)
            return (null, "Piggy bank doesn't belong to this user.");

        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != userId)
            return (null, "Card doesn't belong to this user.");

        return await _piggyBankRepository.DepositAsync(piggyBankId, cardId, amount, cancellationToken);
    }

    public async Task<(PiggyBank? PiggyBank, string Error)> WithdrawAsync(
        int userId,
        int piggyBankId,
        int cardId,
        decimal amount,
        CancellationToken cancellationToken = default)
    {
        if (amount <= 0)
            return (null, "Amount must be greater than zero.");

        var piggyBank = await _piggyBankRepository.GetByIdAsync(piggyBankId, cancellationToken);
        if (piggyBank is null)
            return (null, "Piggy bank not found.");

        if (piggyBank.UserId != userId)
            return (null, "Piggy bank doesn't belong to this user.");

        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != userId)
            return (null, "Card doesn't belong to this user.");

        return await _piggyBankRepository.WithdrawAsync(piggyBankId, cardId, amount, cancellationToken);
    }
}
