using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.API.Contracts;

public record DepositResponse(
    int Id,
    int UserId,
    int CardId,
    decimal PrincipalAmount,
    Currency Currency,
    int TermDays,
    DateTime CreatedAtUtc,
    DateTime MaturityAtUtc,
    DateTime? WithdrawnAtUtc,
    bool IsEarlyWithdrawalNow,
    decimal AppliedRatePercentNow,
    decimal AccruedInterestNow,
    decimal PayoutAmountNow)
{
    public static DepositResponse FromDomain(Deposit deposit) => new(
        deposit.Id, deposit.UserId, deposit.CardId, deposit.PrincipalAmount, deposit.Currency, deposit.TermDays,
        deposit.CreatedAtUtc, deposit.MaturityAtUtc, deposit.WithdrawnAtUtc,
        deposit.IsEarlyWithdrawal(DateTime.UtcNow), deposit.GetAppliedRatePercent(DateTime.UtcNow),
        deposit.GetInterest(DateTime.UtcNow), deposit.GetPayoutAmount(DateTime.UtcNow));
}
