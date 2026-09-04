using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Interfaces;

public interface IInstallmentPlanRepository
{
    Task<InstallmentPlan?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InstallmentPlan>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);

    Task<InstallmentPlan> OpenAsync(
        int userId,
        int cardId,
        decimal amount,
        int monthsCount,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default);

    Task<(InstallmentPlan? Plan, string Error)> PayInstallmentAsync(
        int planId,
        int cardId,
        decimal paymentAmount,
        CancellationToken cancellationToken = default);
}
