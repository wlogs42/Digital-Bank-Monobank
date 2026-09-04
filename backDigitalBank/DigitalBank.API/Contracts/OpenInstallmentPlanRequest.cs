namespace DigitalBank.API.Contracts;

public record OpenInstallmentPlanRequest(int UserId, int CardId, decimal Amount, int MonthsCount);
