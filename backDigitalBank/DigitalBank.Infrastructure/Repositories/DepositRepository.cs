using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class DepositRepository : IDepositRepository
{
    private readonly AppDbContext _context;

    public DepositRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Deposit?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Deposits
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<IReadOnlyList<Deposit>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.Deposits
            .AsNoTracking()
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    public async Task<(Deposit? Deposit, string Error)> OpenAsync(
        int userId,
        int cardId,
        decimal amount,
        Currency currency,
        int termDays,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var debitedRows = await _context.Cards
            .Where(c => c.Id == cardId && c.BalanceAmount >= amount)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount - amount),
                cancellationToken);

        if (debitedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Insufficient funds.");
        }

        var entity = new DepositEntity
        {
            UserId = userId,
            CardId = cardId,
            PrincipalAmount = amount,
            Currency = currency,
            TermDays = termDays,
            CreatedAtUtc = createdAtUtc,
        };

        await _context.Deposits.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        await dbTransaction.CommitAsync(cancellationToken);

        var (deposit, error) = Deposit.Create(entity.Id, userId, cardId, amount, currency, termDays, createdAtUtc);
        return deposit is null ? (null, error) : (deposit, string.Empty);
    }

    public async Task<(Deposit? Deposit, string Error)> WithdrawAsync(
        int depositId,
        int cardId,
        decimal payoutAmount,
        DateTime withdrawnAtUtc,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var markedRows = await _context.Deposits
            .Where(d => d.Id == depositId && d.WithdrawnAtUtc == null)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(d => d.WithdrawnAtUtc, withdrawnAtUtc),
                cancellationToken);

        if (markedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Deposit is already withdrawn.");
        }

        await _context.Cards
            .Where(c => c.Id == cardId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount + payoutAmount),
                cancellationToken);

        await dbTransaction.CommitAsync(cancellationToken);

        var entity = await _context.Deposits.AsNoTracking().FirstAsync(d => d.Id == depositId, cancellationToken);
        return (ToDomain(entity), string.Empty);
    }

    private static Deposit ToDomain(DepositEntity entity)
    {
        var (deposit, error) = Deposit.Create(
            entity.Id, entity.UserId, entity.CardId, entity.PrincipalAmount, entity.Currency,
            entity.TermDays, entity.CreatedAtUtc, entity.WithdrawnAtUtc);

        return deposit ?? throw new InvalidOperationException($"Corrupted deposit data (id={entity.Id}): {error}");
    }
}
