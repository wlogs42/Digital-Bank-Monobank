namespace DigitalBank.API.Contracts;

public record TakeCreditRequest(int UserId, int CardId, decimal Amount, DateOnly DueDate);
