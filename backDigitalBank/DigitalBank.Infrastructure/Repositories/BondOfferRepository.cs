using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class BondOfferRepository : IBondOfferRepository
{
    private readonly AppDbContext _context;

    public BondOfferRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BondOffer?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.BondOffers
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<IReadOnlyList<BondOffer>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var entities = await _context.BondOffers
            .AsNoTracking()
            .OrderBy(o => o.TermDays)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    private static BondOffer ToDomain(BondOfferEntity entity)
    {
        var (offer, error) = BondOffer.Create(
            entity.Id, entity.Name, entity.RequiredAmount, entity.TermDays, entity.AnnualRatePercent);

        return offer ?? throw new InvalidOperationException($"Corrupted bond offer data (id={entity.Id}): {error}");
    }
}
