using DigitalBank.Domain.Models;

namespace DigitalBank.API.Contracts;

public record InstallmentPlanResponse(
    int Id,
    int UserId,
    int CardId,
    decimal PrincipalAmount,
    int MonthsCount,
    decimal MonthlyPayment,
    decimal TotalRepayment,
    int PaidInstallments,
    int RemainingInstallments,
    decimal RemainingAmount,
    bool IsCompleted,
    DateTime CreatedAtUtc,
    DateTime? NextDueAtUtc)
{
    public static InstallmentPlanResponse FromDomain(InstallmentPlan plan) => new(
        plan.Id, plan.UserId, plan.CardId, plan.PrincipalAmount, plan.MonthsCount,
        plan.MonthlyPayment, plan.TotalRepayment, plan.PaidInstallments, plan.RemainingInstallments,
        plan.RemainingAmount, plan.IsCompleted, plan.CreatedAtUtc, plan.NextDueAtUtc);
}
