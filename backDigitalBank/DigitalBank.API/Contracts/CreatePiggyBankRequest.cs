namespace DigitalBank.API.Contracts;

public record CreatePiggyBankRequest(int UserId, string Name, decimal TargetAmount);
