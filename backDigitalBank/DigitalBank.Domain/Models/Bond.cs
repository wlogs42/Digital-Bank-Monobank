namespace DigitalBank.Domain.Models;

public class Bond
{
    private Bond(
        int id,
        int userId,
        int cardId,
        int offerId,
        string offerName,
        decimal principalAmount,
        decimal annualRatePercent,
        int termDays,
        DateTime createdAtUtc,
        DateTime? redeemedAtUtc)
    {
        Id = id;
        UserId = userId;
        CardId = cardId;
        OfferId = offerId;
        OfferName = offerName;
        PrincipalAmount = principalAmount;
        AnnualRatePercent = annualRatePercent;
        TermDays = termDays;
        CreatedAtUtc = createdAtUtc;
        RedeemedAtUtc = redeemedAtUtc;
    }

    public int Id { get; }
    public int UserId { get; }
    public int CardId { get; }
    public int OfferId { get; }
    public string OfferName { get; }
    public decimal PrincipalAmount { get; }
    public decimal AnnualRatePercent { get; }
    public int TermDays { get; }
    public DateTime CreatedAtUtc { get; }
    public DateTime? RedeemedAtUtc { get; }
    public bool IsRedeemed => RedeemedAtUtc is not null;
    public DateTime MaturityAtUtc => CreatedAtUtc.AddDays(TermDays);

    public decimal GetYield(DateTime asOfUtc)
    {
        var end = RedeemedAtUtc ?? asOfUtc;
        var daysElapsed = Math.Max(0, Math.Min(TermDays, (end.Date - CreatedAtUtc.Date).Days));
        return Math.Round(PrincipalAmount * AnnualRatePercent / 100m / 365m * daysElapsed, 2);
    }

    public decimal GetPayoutAmount(DateTime asOfUtc) => PrincipalAmount + GetYield(asOfUtc);

    public static (Bond? Bond, string Error) Create(
        int id,
        int userId,
        int cardId,
        int offerId,
        string offerName,
        decimal principalAmount,
        decimal annualRatePercent,
        int termDays,
        DateTime createdAtUtc,
        DateTime? redeemedAtUtc = null)
    {
        if (principalAmount <= 0)
            return (null, "Bond amount must be greater than zero.");

        if (termDays <= 0)
            return (null, "Term must be at least one day.");

        var bond = new Bond(
            id, userId, cardId, offerId, offerName, principalAmount, annualRatePercent, termDays, createdAtUtc, redeemedAtUtc);
        return (bond, string.Empty);
    }
}
