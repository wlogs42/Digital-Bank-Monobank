using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Services;

public class InstallmentPlanService
{
    private readonly ICardRepository _cardRepository;
    private readonly IInstallmentPlanRepository _planRepository;

    public InstallmentPlanService(ICardRepository cardRepository, IInstallmentPlanRepository planRepository)
    {
        _cardRepository = cardRepository;
        _planRepository = planRepository;
    }

    public async Task<(InstallmentPlan? Plan, string Error)> OpenAsync(
        int userId,
        int cardId,
        decimal amount,
        int monthsCount,
        CancellationToken cancellationToken = default)
    {
        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != userId)
            return (null, "Card doesn't belong to this user.");

        var (validated, error) = InstallmentPlan.Create(0, userId, cardId, amount, monthsCount, 0, DateTime.UtcNow);
        if (validated is null)
            return (null, error);

        var plan = await _planRepository.OpenAsync(userId, cardId, amount, monthsCount, DateTime.UtcNow, cancellationToken);
        return (plan, string.Empty);
    }

    public async Task<(InstallmentPlan? Plan, string Error)> PayInstallmentAsync(
        int planId,
        int cardId,
        CancellationToken cancellationToken = default)
    {
        var plan = await _planRepository.GetByIdAsync(planId, cancellationToken);
        if (plan is null)
            return (null, "Installment plan not found.");

        if (plan.IsCompleted)
            return (null, "Installment plan is already fully paid.");

        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != plan.UserId)
            return (null, "Card doesn't belong to this user.");

        return await _planRepository.PayInstallmentAsync(planId, cardId, plan.MonthlyPayment, cancellationToken);
    }
}
