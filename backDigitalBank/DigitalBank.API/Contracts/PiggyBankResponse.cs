using DigitalBank.Domain.Models;

namespace DigitalBank.API.Contracts;

public record PiggyBankResponse(
    int Id,
    int UserId,
    string Name,
    decimal TargetAmount,
    decimal CurrentAmount,
    DateTime CreatedAtUtc)
{
    public static PiggyBankResponse FromDomain(PiggyBank piggyBank) => new(
        piggyBank.Id, piggyBank.UserId, piggyBank.Name,
        piggyBank.TargetAmount, piggyBank.CurrentAmount, piggyBank.CreatedAtUtc);
}
