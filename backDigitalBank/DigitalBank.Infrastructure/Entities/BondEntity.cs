namespace DigitalBank.Infrastructure.Entities;

public class BondEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CardId { get; set; }
    public int OfferId { get; set; }
    public string OfferName { get; set; } = string.Empty;
    public decimal PrincipalAmount { get; set; }
    public decimal AnnualRatePercent { get; set; }
    public int TermDays { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? RedeemedAtUtc { get; set; }
}
