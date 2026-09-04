namespace DigitalBank.Infrastructure.Entities;

public class InstallmentPlanEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CardId { get; set; }
    public decimal PrincipalAmount { get; set; }
    public int MonthsCount { get; set; }
    public int PaidInstallments { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
