using DigitalBank.Domain.Models;

namespace DigitalBank.API.Contracts;

public record BondOfferResponse(int Id, string Name, decimal RequiredAmount, int TermDays, decimal AnnualRatePercent)
{
    public static BondOfferResponse FromDomain(BondOffer offer) => new(
        offer.Id, offer.Name, offer.RequiredAmount, offer.TermDays, offer.AnnualRatePercent);
}
