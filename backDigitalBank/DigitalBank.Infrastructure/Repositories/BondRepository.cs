using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class BondRepository : IBondRepository
{
    private readonly AppDbContext _context;

    public BondRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Bond?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Bonds
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<IReadOnlyList<Bond>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.Bonds
            .AsNoTracking()
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    public async Task<(Bond? Bond, string Error)> BuyAsync(
        int userId,
        int cardId,
        BondOffer offer,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var debitedRows = await _context.Cards
            .Where(c => c.Id == cardId && c.BalanceAmount >= offer.RequiredAmount)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount - offer.RequiredAmount),
                cancellationToken);

        if (debitedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Insufficient funds.");
        }

        var entity = new BondEntity
        {
            UserId = userId,
            CardId = cardId,
            OfferId = offer.Id,
            OfferName = offer.Name,
            PrincipalAmount = offer.RequiredAmount,
            AnnualRatePercent = offer.AnnualRatePercent,
            TermDays = offer.TermDays,
            CreatedAtUtc = createdAtUtc,
        };

        await _context.Bonds.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        await dbTransaction.CommitAsync(cancellationToken);

        var (bond, error) = Bond.Create(
            entity.Id, userId, cardId, offer.Id, offer.Name,
            offer.RequiredAmount, offer.AnnualRatePercent, offer.TermDays, createdAtUtc);
        return bond is null ? (null, error) : (bond, string.Empty);
    }

    public async Task<(Bond? Bond, string Error)> RedeemAsync(
        int bondId,
        int cardId,
        decimal payoutAmount,
        DateTime redeemedAtUtc,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var markedRows = await _context.Bonds
            .Where(b => b.Id == bondId && b.RedeemedAtUtc == null)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(b => b.RedeemedAtUtc, redeemedAtUtc),
                cancellationToken);

        if (markedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Bond is already redeemed.");
        }

        await _context.Cards
            .Where(c => c.Id == cardId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount + payoutAmount),
                cancellationToken);

        await dbTransaction.CommitAsync(cancellationToken);

        var entity = await _context.Bonds.AsNoTracking().FirstAsync(b => b.Id == bondId, cancellationToken);
        return (ToDomain(entity), string.Empty);
    }

    private static Bond ToDomain(BondEntity entity)
    {
        var (bond, error) = Bond.Create(
            entity.Id, entity.UserId, entity.CardId, entity.OfferId, entity.OfferName,
            entity.PrincipalAmount, entity.AnnualRatePercent, entity.TermDays, entity.CreatedAtUtc, entity.RedeemedAtUtc);

        return bond ?? throw new InvalidOperationException($"Corrupted bond data (id={entity.Id}): {error}");
    }
}
