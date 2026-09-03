namespace DigitalBank.Domain.Models;

public class PiggyBank
{
    private PiggyBank(
        int id,
        int userId,
        string name,
        decimal targetAmount,
        decimal currentAmount,
        DateTime createdAtUtc)
    {
        Id = id;
        UserId = userId;
        Name = name;
        TargetAmount = targetAmount;
        CurrentAmount = currentAmount;
        CreatedAtUtc = createdAtUtc;
    }

    public int Id { get; }
    public int UserId { get; }
    public string Name { get; }
    public decimal TargetAmount { get; }
    public decimal CurrentAmount { get; }
    public DateTime CreatedAtUtc { get; }

    public static (PiggyBank? PiggyBank, string Error) Create(
        int id,
        int userId,
        string name,
        decimal targetAmount,
        decimal currentAmount,
        DateTime createdAtUtc)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length > 100)
            return (null, "Name can't be empty or longer than 100 characters.");

        if (targetAmount <= 0)
            return (null, "Target amount must be greater than zero.");

        if (currentAmount < 0)
            return (null, "Current amount can't be negative.");

        var piggyBank = new PiggyBank(id, userId, name, targetAmount, currentAmount, createdAtUtc);
        return (piggyBank, string.Empty);
    }
}
