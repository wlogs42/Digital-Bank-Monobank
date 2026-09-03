using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Interfaces;

public interface IPiggyBankRepository
{
    Task<PiggyBank?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PiggyBank>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);

    Task<PiggyBank> CreateAsync(
        int userId,
        string name,
        decimal targetAmount,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default);

    Task<(PiggyBank? PiggyBank, string Error)> DepositAsync(
        int piggyBankId,
        int cardId,
        decimal amount,
        CancellationToken cancellationToken = default);

    Task<(PiggyBank? PiggyBank, string Error)> WithdrawAsync(
        int piggyBankId,
        int cardId,
        decimal amount,
        CancellationToken cancellationToken = default);
}
