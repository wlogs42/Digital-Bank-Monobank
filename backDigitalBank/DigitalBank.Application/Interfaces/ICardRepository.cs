using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Interfaces;

public interface ICardRepository
{
    Task<Card?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Card?> GetByCardNumberAsync(string cardNumber, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Card>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<Card> AddAsync(Card card, CancellationToken cancellationToken = default);
    Task UpdateAsync(Card card, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
