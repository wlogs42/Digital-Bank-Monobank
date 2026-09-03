using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.API.Contracts;

public record CreateCardRequest(
    int UserId,
    string CardType,
    string Name,
    string FirstName,
    decimal InitialAmount,
    Currency Currency);
