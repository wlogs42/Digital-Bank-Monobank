using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Interfaces;

public interface IBondOfferRepository
{
    Task<BondOffer?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BondOffer>> GetAllAsync(CancellationToken cancellationToken = default);
}
