namespace DigitalBank.API.Contracts;

public record TransferRequest(int FromCardId, string ToCardNumber, decimal Amount);
