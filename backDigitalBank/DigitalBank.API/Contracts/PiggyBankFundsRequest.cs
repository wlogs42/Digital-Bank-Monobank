namespace DigitalBank.API.Contracts;

public record PiggyBankFundsRequest(int UserId, int CardId, decimal Amount);
