namespace DigitalBank.Domain.Models;

public class Credit
{
    public const decimal DailyFeeAmount = 3m;

    private Credit(
        int id,
        int userId,
        int cardId,
        decimal principalAmount,
        DateOnly dueDate,
        DateTime createdAtUtc,
        DateTime? repaidAtUtc)
    {
        Id = id;
        UserId = userId;
        CardId = cardId;
        PrincipalAmount = principalAmount;
        DueDate = dueDate;
        CreatedAtUtc = createdAtUtc;
        RepaidAtUtc = repaidAtUtc;
    }

    public int Id { get; }
    public int UserId { get; }
    public int CardId { get; }
    public decimal PrincipalAmount { get; }
    public DateOnly DueDate { get; }
    public DateTime CreatedAtUtc { get; }
    public DateTime? RepaidAtUtc { get; }
    public bool IsRepaid => RepaidAtUtc is not null;

    public decimal GetOwedAmount(DateTime asOfUtc)
    {
        var end = RepaidAtUtc ?? asOfUtc;
        var daysElapsed = Math.Max(0, (end.Date - CreatedAtUtc.Date).Days);
        return PrincipalAmount + daysElapsed * DailyFeeAmount;
    }

    public static (Credit? Credit, string Error) Create(
        int id,
        int userId,
        int cardId,
        decimal principalAmount,
        DateOnly dueDate,
        DateTime createdAtUtc,
        DateTime? repaidAtUtc = null)
    {
        if (principalAmount <= 0)
            return (null, "Credit amount must be greater than zero.");

        if (dueDate <= DateOnly.FromDateTime(createdAtUtc))
            return (null, "Due date must be at least one day in the future.");

        var credit = new Credit(id, userId, cardId, principalAmount, dueDate, createdAtUtc, repaidAtUtc);
        return (credit, string.Empty);
    }
}
