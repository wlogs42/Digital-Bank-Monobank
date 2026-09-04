namespace DigitalBank.Domain.Models;

public class InstallmentPlan
{
    public const decimal AnnualRatePercent = 20m;

    private InstallmentPlan(
        int id,
        int userId,
        int cardId,
        decimal principalAmount,
        int monthsCount,
        int paidInstallments,
        DateTime createdAtUtc)
    {
        Id = id;
        UserId = userId;
        CardId = cardId;
        PrincipalAmount = principalAmount;
        MonthsCount = monthsCount;
        PaidInstallments = paidInstallments;
        CreatedAtUtc = createdAtUtc;
    }

    public int Id { get; }
    public int UserId { get; }
    public int CardId { get; }
    public decimal PrincipalAmount { get; }
    public int MonthsCount { get; }
    public int PaidInstallments { get; }
    public DateTime CreatedAtUtc { get; }

    public decimal TotalRepayment => Math.Round(PrincipalAmount * (1 + AnnualRatePercent / 100m * MonthsCount / 12m), 2);
    public decimal MonthlyPayment => Math.Round(TotalRepayment / MonthsCount, 2);
    public bool IsCompleted => PaidInstallments >= MonthsCount;
    public int RemainingInstallments => Math.Max(0, MonthsCount - PaidInstallments);
    public decimal RemainingAmount => Math.Round(MonthlyPayment * RemainingInstallments, 2);
    public DateTime? NextDueAtUtc => IsCompleted ? null : CreatedAtUtc.AddMonths(PaidInstallments + 1);

    public static (InstallmentPlan? Plan, string Error) Create(
        int id,
        int userId,
        int cardId,
        decimal principalAmount,
        int monthsCount,
        int paidInstallments,
        DateTime createdAtUtc)
    {
        if (principalAmount <= 0)
            return (null, "Amount must be greater than zero.");

        if (monthsCount <= 0)
            return (null, "Months count must be greater than zero.");

        if (paidInstallments < 0 || paidInstallments > monthsCount)
            return (null, "Invalid paid installments count.");

        var plan = new InstallmentPlan(id, userId, cardId, principalAmount, monthsCount, paidInstallments, createdAtUtc);
        return (plan, string.Empty);
    }
}
