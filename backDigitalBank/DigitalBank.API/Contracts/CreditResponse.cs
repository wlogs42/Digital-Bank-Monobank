using DigitalBank.Domain.Models;

namespace DigitalBank.API.Contracts;

public record CreditResponse(
    int Id,
    int UserId,
    int CardId,
    decimal PrincipalAmount,
    DateOnly DueDate,
    DateTime CreatedAtUtc,
    DateTime? RepaidAtUtc,
    decimal OwedAmountNow)
{
    public static CreditResponse FromDomain(Credit credit) => new(
        credit.Id, credit.UserId, credit.CardId, credit.PrincipalAmount,
        credit.DueDate, credit.CreatedAtUtc, credit.RepaidAtUtc, credit.GetOwedAmount(DateTime.UtcNow));
}
