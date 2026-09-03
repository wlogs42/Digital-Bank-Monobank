using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class PiggyBankRepository : IPiggyBankRepository
{
    private readonly AppDbContext _context;

    public PiggyBankRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PiggyBank?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.PiggyBanks
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<IReadOnlyList<PiggyBank>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.PiggyBanks
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    public async Task<PiggyBank> CreateAsync(
        int userId,
        string name,
        decimal targetAmount,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default)
    {
        var entity = new PiggyBankEntity
        {
            UserId = userId,
            Name = name,
            TargetAmount = targetAmount,
            CurrentAmount = 0,
            CreatedAtUtc = createdAtUtc,
        };

        await _context.PiggyBanks.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return ToDomain(entity);
    }

    public async Task<(PiggyBank? PiggyBank, string Error)> DepositAsync(
        int piggyBankId,
        int cardId,
        decimal amount,
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

        await _context.PiggyBanks
            .Where(p => p.Id == piggyBankId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(p => p.CurrentAmount, p => p.CurrentAmount + amount),
                cancellationToken);

        await dbTransaction.CommitAsync(cancellationToken);

        var entity = await _context.PiggyBanks.AsNoTracking().FirstAsync(p => p.Id == piggyBankId, cancellationToken);
        return (ToDomain(entity), string.Empty);
    }

    public async Task<(PiggyBank? PiggyBank, string Error)> WithdrawAsync(
        int piggyBankId,
        int cardId,
        decimal amount,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var withdrawnRows = await _context.PiggyBanks
            .Where(p => p.Id == piggyBankId && p.CurrentAmount >= amount)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(p => p.CurrentAmount, p => p.CurrentAmount - amount),
                cancellationToken);

        if (withdrawnRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Insufficient funds in the piggy bank.");
        }

        await _context.Cards
            .Where(c => c.Id == cardId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount + amount),
                cancellationToken);

        await dbTransaction.CommitAsync(cancellationToken);

        var entity = await _context.PiggyBanks.AsNoTracking().FirstAsync(p => p.Id == piggyBankId, cancellationToken);
        return (ToDomain(entity), string.Empty);
    }

    private static PiggyBank ToDomain(PiggyBankEntity entity)
    {
        var (piggyBank, error) = PiggyBank.Create(
            entity.Id, entity.UserId, entity.Name, entity.TargetAmount, entity.CurrentAmount, entity.CreatedAtUtc);

        return piggyBank ?? throw new InvalidOperationException($"Corrupted piggy bank data (id={entity.Id}): {error}");
    }
}
