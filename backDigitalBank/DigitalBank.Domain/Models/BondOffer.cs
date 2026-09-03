namespace DigitalBank.Domain.Models;

public class BondOffer
{
    private BondOffer(int id, string name, decimal requiredAmount, int termDays, decimal annualRatePercent)
    {
        Id = id;
        Name = name;
        RequiredAmount = requiredAmount;
        TermDays = termDays;
        AnnualRatePercent = annualRatePercent;
    }

    public int Id { get; }
    public string Name { get; }
    public decimal RequiredAmount { get; }
    public int TermDays { get; }
    public decimal AnnualRatePercent { get; }

    public static (BondOffer? BondOffer, string Error) Create(
        int id, string name, decimal requiredAmount, int termDays, decimal annualRatePercent)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length > 100)
            return (null, "Name can't be empty or longer than 100 characters.");

        if (requiredAmount <= 0)
            return (null, "Required amount must be greater than zero.");

        if (termDays <= 0)
            return (null, "Term must be at least one day.");

        if (annualRatePercent <= 0)
            return (null, "Rate must be greater than zero.");

        var offer = new BondOffer(id, name, requiredAmount, termDays, annualRatePercent);
        return (offer, string.Empty);
    }
}
