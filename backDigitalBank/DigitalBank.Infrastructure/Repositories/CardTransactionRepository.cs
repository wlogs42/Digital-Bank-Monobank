using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class CardTransactionRepository : ICardTransactionRepository
{
    private readonly AppDbContext _context;

    public CardTransactionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(CardTransaction? Transaction, string Error)> TransferAsync(
        int fromCardId,
        int toCardId,
        decimal amount,
        Currency currency,
        CancellationToken cancellationToken = default)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        var debitedRows = await _context.Cards
            .Where(c => c.Id == fromCardId && c.BalanceAmount >= amount)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount - amount),
                cancellationToken);

        if (debitedRows == 0)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return (null, "Insufficient funds.");
        }

        await _context.Cards
            .Where(c => c.Id == toCardId)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(c => c.BalanceAmount, c => c.BalanceAmount + amount),
                cancellationToken);

        var entity = new CardTransactionEntity
        {
            FromCardId = fromCardId,
            ToCardId = toCardId,
            Amount = amount,
            Currency = currency,
            CreatedAtUtc = DateTime.UtcNow,
        };

        await _context.CardTransactions.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        await dbTransaction.CommitAsync(cancellationToken);

        return CardTransaction.Create(entity.Id, fromCardId, toCardId, amount, currency, entity.CreatedAtUtc);
    }

    public async Task<IReadOnlyList<CardTransaction>> GetByCardIdAsync(int cardId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.CardTransactions
            .AsNoTracking()
            .Where(t => t.FromCardId == cardId || t.ToCardId == cardId)
            .OrderByDescending(t => t.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    private static CardTransaction ToDomain(CardTransactionEntity entity)
    {
        var (transaction, error) = CardTransaction.Create(
            entity.Id, entity.FromCardId, entity.ToCardId, entity.Amount, entity.Currency, entity.CreatedAtUtc);

        return transaction ?? throw new InvalidOperationException($"Corrupted transaction data (id={entity.Id}): {error}");
    }
}
