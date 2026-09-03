using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Interfaces;

public interface ICreditRepository
{
    Task<Credit?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Credit>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);

    Task<Credit> TakeAsync(
        int userId,
        int cardId,
        decimal amount,
        DateOnly dueDate,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default);

    Task<(Credit? Credit, string Error)> RepayAsync(
        int creditId,
        int cardId,
        decimal owedAmount,
        DateTime repaidAtUtc,
        CancellationToken cancellationToken = default);
}
