using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Services;

public class BondService
{
    private readonly ICardRepository _cardRepository;
    private readonly IBondRepository _bondRepository;
    private readonly IBondOfferRepository _bondOfferRepository;

    public BondService(ICardRepository cardRepository, IBondRepository bondRepository, IBondOfferRepository bondOfferRepository)
    {
        _cardRepository = cardRepository;
        _bondRepository = bondRepository;
        _bondOfferRepository = bondOfferRepository;
    }

    public async Task<(Bond? Bond, string Error)> BuyAsync(
        int userId,
        int cardId,
        int offerId,
        CancellationToken cancellationToken = default)
    {
        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != userId)
            return (null, "Card doesn't belong to this user.");

        var offer = await _bondOfferRepository.GetByIdAsync(offerId, cancellationToken);
        if (offer is null)
            return (null, "Bond offer not found.");

        return await _bondRepository.BuyAsync(userId, cardId, offer, DateTime.UtcNow, cancellationToken);
    }

    public async Task<(Bond? Bond, string Error)> RedeemAsync(
        int bondId,
        int cardId,
        CancellationToken cancellationToken = default)
    {
        var bond = await _bondRepository.GetByIdAsync(bondId, cancellationToken);
        if (bond is null)
            return (null, "Bond not found.");

        if (bond.IsRedeemed)
            return (null, "Bond is already redeemed.");

        var card = await _cardRepository.GetByIdAsync(cardId, cancellationToken);
        if (card is null)
            return (null, "Card not found.");

        if (card.UserId != bond.UserId)
            return (null, "Card doesn't belong to this user.");

        var payoutAmount = bond.GetPayoutAmount(DateTime.UtcNow);

        return await _bondRepository.RedeemAsync(bondId, cardId, payoutAmount, DateTime.UtcNow, cancellationToken);
    }
}
