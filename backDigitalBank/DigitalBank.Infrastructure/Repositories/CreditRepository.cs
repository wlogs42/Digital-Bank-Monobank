using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class CreditRepository : ICreditRepository
{
    private readonly AppDbContext _context;

    public CreditRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Credit?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Credits
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<IReadOnlyList<Credit>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.Credits
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    public async Task<Credit> TakeAsync(
        int userId,
        int cardId,
        decimal amount,
        DateOnly dueDate,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var entity = new CreditEntity
        {
            UserId = userId,
            CardId = cardId,
            PrincipalAmount = amount,
            DueDate = dueDate,
            CreatedAtUtc = createdAtUtc,
        };

        await _context.Credits.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        await _context.Cards
            .Where(c => c.Id == cardId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount + amount),
                cancellationToken);

        await dbTransaction.CommitAsync(cancellationToken);

        var (credit, error) = Credit.Create(entity.Id, userId, cardId, amount, dueDate, createdAtUtc);
        return credit ?? throw new InvalidOperationException($"Failed to build credit: {error}");
    }

    public async Task<(Credit? Credit, string Error)> RepayAsync(
        int creditId,
        int cardId,
        decimal owedAmount,
        DateTime repaidAtUtc,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var markedRows = await _context.Credits
            .Where(c => c.Id == creditId && c.RepaidAtUtc == null)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.RepaidAtUtc, repaidAtUtc),
                cancellationToken);

        if (markedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Credit is already repaid.");
        }

        var debitedRows = await _context.Cards
            .Where(c => c.Id == cardId && c.BalanceAmount >= owedAmount)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount - owedAmount),
                cancellationToken);

        if (debitedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Insufficient funds.");
        }

        await dbTransaction.CommitAsync(cancellationToken);

        var entity = await _context.Credits
            .AsNoTracking()
            .FirstAsync(c => c.Id == creditId, cancellationToken);

        return (ToDomain(entity), string.Empty);
    }

    private static Credit ToDomain(CreditEntity entity)
    {
        var (credit, error) = Credit.Create(
            entity.Id, entity.UserId, entity.CardId, entity.PrincipalAmount,
            entity.DueDate, entity.CreatedAtUtc, entity.RepaidAtUtc);

        return credit ?? throw new InvalidOperationException($"Corrupted credit data (id={entity.Id}): {error}");
    }
}
