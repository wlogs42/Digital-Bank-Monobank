using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class InstallmentPlanRepository : IInstallmentPlanRepository
{
    private readonly AppDbContext _context;

    public InstallmentPlanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<InstallmentPlan?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.InstallmentPlans
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<IReadOnlyList<InstallmentPlan>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.InstallmentPlans
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    public async Task<InstallmentPlan> OpenAsync(
        int userId,
        int cardId,
        decimal amount,
        int monthsCount,
        DateTime createdAtUtc,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var entity = new InstallmentPlanEntity
        {
            UserId = userId,
            CardId = cardId,
            PrincipalAmount = amount,
            MonthsCount = monthsCount,
            PaidInstallments = 0,
            CreatedAtUtc = createdAtUtc,
        };

        await _context.InstallmentPlans.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        await _context.Cards
            .Where(c => c.Id == cardId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount + amount),
                cancellationToken);

        await dbTransaction.CommitAsync(cancellationToken);

        var (plan, error) = InstallmentPlan.Create(entity.Id, userId, cardId, amount, monthsCount, 0, createdAtUtc);
        return plan ?? throw new InvalidOperationException($"Failed to build installment plan: {error}");
    }

    public async Task<(InstallmentPlan? Plan, string Error)> PayInstallmentAsync(
        int planId,
        int cardId,
        decimal paymentAmount,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var debitedRows = await _context.Cards
            .Where(c => c.Id == cardId && c.BalanceAmount >= paymentAmount)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount - paymentAmount),
                cancellationToken);

        if (debitedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Insufficient funds.");
        }

        var updatedRows = await _context.InstallmentPlans
            .Where(p => p.Id == planId && p.PaidInstallments < p.MonthsCount)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(p => p.PaidInstallments, p => p.PaidInstallments + 1),
                cancellationToken);

        if (updatedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Installment plan is already fully paid.");
        }

        await dbTransaction.CommitAsync(cancellationToken);

        var entity = await _context.InstallmentPlans.AsNoTracking().FirstAsync(p => p.Id == planId, cancellationToken);
        return (ToDomain(entity), string.Empty);
    }

    private static InstallmentPlan ToDomain(InstallmentPlanEntity entity)
    {
        var (plan, error) = InstallmentPlan.Create(
            entity.Id, entity.UserId, entity.CardId, entity.PrincipalAmount,
            entity.MonthsCount, entity.PaidInstallments, entity.CreatedAtUtc);

        return plan ?? throw new InvalidOperationException($"Corrupted installment plan data (id={entity.Id}): {error}");
    }
}
