using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;
using DigitalBank.Infrastructure.Entities;
using DigitalBank.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Repositories;

public class CardRepository : ICardRepository
{
    private readonly AppDbContext _context;

    public CardRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Card?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Cards
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<Card?> GetByCardNumberAsync(string cardNumber, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Cards
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.CardNumber == cardNumber, cancellationToken);

        return entity is null ? null : ToDomain(entity);
    }

    public async Task<IReadOnlyList<Card>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.Cards
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .ToListAsync(cancellationToken);

        return entities.Select(ToDomain).ToList();
    }

    public async Task<Card> AddAsync(Card card, CancellationToken cancellationToken = default)
    {
        var entity = ToEntity(card);

        await _context.Cards.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return ToDomain(entity);
    }

    public async Task UpdateAsync(Card card, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Cards.FirstOrDefaultAsync(c => c.Id == card.Id, cancellationToken)
            ?? throw new InvalidOperationException($"Card with id {card.Id} was not found.");

        entity.CardNumber = card.CardNumber;
        entity.ExpirationDate = card.ExpirationDate;
        entity.SecurityCode = card.SecurityCode;
        entity.CardType = card.CardType;
        entity.Name = card.Name;
        entity.FirstName = card.FirstName;
        entity.BalanceAmount = card.Balance.Amount;
        entity.BalanceCurrency = card.Balance.Currency;

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Cards.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (entity is null)
            return;

        _context.Cards.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private static Card ToDomain(CardEntity entity)
    {
        var (balance, balanceError) = Money.Create(entity.BalanceAmount, entity.BalanceCurrency);
        if (balance is null)
            throw new InvalidOperationException($"Corrupted card balance in database (id={entity.Id}): {balanceError}");

        var (card, error) = Card.Create(
            entity.Id, entity.UserId, entity.CardNumber, entity.ExpirationDate,
            entity.SecurityCode, entity.CardType, entity.Name, entity.FirstName, balance);

        return card ?? throw new InvalidOperationException($"Corrupted card data in database (id={entity.Id}): {error}");
    }

    private static CardEntity ToEntity(Card card) => new()
    {
        Id = card.Id,
        UserId = card.UserId,
        CardNumber = card.CardNumber,
        ExpirationDate = card.ExpirationDate,
        SecurityCode = card.SecurityCode,
        CardType = card.CardType,
        Name = card.Name,
        FirstName = card.FirstName,
        BalanceAmount = card.Balance.Amount,
        BalanceCurrency = card.Balance.Currency
    };
}
