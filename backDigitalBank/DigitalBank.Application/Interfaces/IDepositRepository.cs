using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Application.Interfaces;

public interface IDepositRepository
{
    Task<Deposit?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Deposit>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);

    Task<(Deposit? Deposit, string Error)> OpenAsync(
        int userId,
        int cardId,
        decimal amount,
        Currency currency,
        int termDays,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default);

    Task<(Deposit? Deposit, string Error)> WithdrawAsync(
        int depositId,
        int cardId,
        decimal payoutAmount,
        DateTime withdrawnAtUtc,
        CancellationToken cancellationToken = default);
}
