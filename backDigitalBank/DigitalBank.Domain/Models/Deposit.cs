using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Domain.Models;

public class Deposit
{
    private static readonly Dictionary<Currency, (decimal MaturityRate, decimal EarlyRate)> RatesByCurrency = new()
    {
        [Currency.UAH] = (15m, 7m),
        [Currency.USD] = (4m, 1.5m),
        [Currency.EUR] = (3m, 1m),
    };

    private Deposit(
        int id,
        int userId,
        int cardId,
        decimal principalAmount,
        Currency currency,
        int termDays,
        DateTime createdAtUtc,
        DateTime? withdrawnAtUtc)
    {
        Id = id;
        UserId = userId;
        CardId = cardId;
        PrincipalAmount = principalAmount;
        Currency = currency;
        TermDays = termDays;
        CreatedAtUtc = createdAtUtc;
        WithdrawnAtUtc = withdrawnAtUtc;
    }

    public int Id { get; }
    public int UserId { get; }
    public int CardId { get; }
    public decimal PrincipalAmount { get; }
    public Currency Currency { get; }
    public int TermDays { get; }
    public DateTime CreatedAtUtc { get; }
    public DateTime? WithdrawnAtUtc { get; }
    public bool IsWithdrawn => WithdrawnAtUtc is not null;
    public DateTime MaturityAtUtc => CreatedAtUtc.AddDays(TermDays);

    public static (decimal MaturityRatePercent, decimal EarlyRatePercent) GetRates(Currency currency) => RatesByCurrency[currency];

    public bool IsEarlyWithdrawal(DateTime asOfUtc)
    {
        var end = WithdrawnAtUtc ?? asOfUtc;
        return end < MaturityAtUtc;
    }

    public decimal GetAppliedRatePercent(DateTime asOfUtc)
    {
        var (maturityRate, earlyRate) = GetRates(Currency);
        return IsEarlyWithdrawal(asOfUtc) ? earlyRate : maturityRate;
    }

    public decimal GetInterest(DateTime asOfUtc)
    {
        var end = WithdrawnAtUtc ?? asOfUtc;
        var daysElapsed = Math.Max(0, Math.Min(TermDays, (end.Date - CreatedAtUtc.Date).Days));
        var rate = GetAppliedRatePercent(asOfUtc);
        return Math.Round(PrincipalAmount * rate / 100m / 365m * daysElapsed, 2);
    }

    public decimal GetPayoutAmount(DateTime asOfUtc) => PrincipalAmount + GetInterest(asOfUtc);

    public static (Deposit? Deposit, string Error) Create(
        int id,
        int userId,
        int cardId,
        decimal principalAmount,
        Currency currency,
        int termDays,
        DateTime createdAtUtc,
        DateTime? withdrawnAtUtc = null)
    {
        if (principalAmount <= 0)
            return (null, "Deposit amount must be greater than zero.");

        if (termDays <= 0)
            return (null, "Term must be at least one day.");

        var deposit = new Deposit(id, userId, cardId, principalAmount, currency, termDays, createdAtUtc, withdrawnAtUtc);
        return (deposit, string.Empty);
    }
}
