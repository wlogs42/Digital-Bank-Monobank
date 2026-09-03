using DigitalBank.Domain.Models;

namespace DigitalBank.API.Contracts;

public record BondResponse(
    int Id,
    int UserId,
    int CardId,
    int OfferId,
    string OfferName,
    decimal PrincipalAmount,
    decimal AnnualRatePercent,
    int TermDays,
    DateTime CreatedAtUtc,
    DateTime MaturityAtUtc,
    DateTime? RedeemedAtUtc,
    decimal AccruedYieldNow,
    decimal PayoutAmountNow)
{
    public static BondResponse FromDomain(Bond bond) => new(
        bond.Id, bond.UserId, bond.CardId, bond.OfferId, bond.OfferName,
        bond.PrincipalAmount, bond.AnnualRatePercent, bond.TermDays,
        bond.CreatedAtUtc, bond.MaturityAtUtc, bond.RedeemedAtUtc,
        bond.GetYield(DateTime.UtcNow), bond.GetPayoutAmount(DateTime.UtcNow));
}
