using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Services;

public class CreditService
{
    private readonly ICardRepository _cardRepository;
    private readonly ICreditRepository _creditRepository;

    public CreditService(ICardRepository cardRepository, ICreditRepository creditRepository)
    {
        _cardRepository = cardRepository;
        _creditRepository = creditRepository;
    }

    public async Task<(Credit? Credit, string Error)> TakeCreditAsync(
        int userId,
        int cardId,
        decimal amount,
        DateOnly dueDate,
        CancellationToken cancellationToken = default)
    {
        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != userId)
            return (null, "Card doesn't belong to this user.");

        var (validated, error) = Credit.Create(0, userId, cardId, amount, dueDate, DateTime.UtcNow);
        if (validated is null)
            return (null, error);

        var credit = await _creditRepository.TakeAsync(userId, cardId, amount, dueDate, DateTime.UtcNow, cancellationToken);
        return (credit, string.Empty);
    }

    public async Task<(Credit? Credit, string Error)> RepayCreditAsync(
        int creditId,
        int cardId,
        CancellationToken cancellationToken = default)
    {
        var credit = await _creditRepository.GetByIdAsync(creditId, cancellationToken);
        if (credit is null)
            return (null, "Credit not found.");

        if (credit.IsRepaid)
            return (null, "Credit is already repaid.");

        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != credit.UserId)
            return (null, "Card doesn't belong to this user.");

        var owedAmount = credit.GetOwedAmount(DateTime.UtcNow);

        return await _creditRepository.RepayAsync(creditId, cardId, owedAmount, DateTime.UtcNow, cancellationToken);
    }
}
