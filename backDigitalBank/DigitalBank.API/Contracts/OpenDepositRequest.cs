namespace DigitalBank.API.Contracts;

public record OpenDepositRequest(int UserId, int CardId, decimal Amount, int TermDays);
