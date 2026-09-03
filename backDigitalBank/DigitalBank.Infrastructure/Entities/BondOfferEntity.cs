namespace DigitalBank.Infrastructure.Entities;

public class BondOfferEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal RequiredAmount { get; set; }
    public int TermDays { get; set; }
    public decimal AnnualRatePercent { get; set; }
}
