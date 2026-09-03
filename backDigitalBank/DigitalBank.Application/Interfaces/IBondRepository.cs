using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Interfaces;

public interface IBondRepository
{
    Task<Bond?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Bond>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);

    Task<(Bond? Bond, string Error)> BuyAsync(
        int userId,
        int cardId,
        BondOffer offer,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default);

    Task<(Bond? Bond, string Error)> RedeemAsync(
        int bondId,
        int cardId,
        decimal payoutAmount,
        DateTime redeemedAtUtc,
        CancellationToken cancellationToken = default);
}
