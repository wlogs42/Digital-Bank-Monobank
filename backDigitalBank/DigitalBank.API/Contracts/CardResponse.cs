using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.API.Contracts;

public record CardResponse(
    int Id,
    int UserId,
    string CardNumber,
    string ExpirationDate, 
    string SecurityCode, 
    string CardType,
    string Name,
    string FirstName,
    decimal BalanceAmount,
    Currency BalanceCurrency)
{
    public static CardResponse FromDomain(Card card) => new(
        card.Id, card.UserId, card.CardNumber, card.ExpirationDate, 
        card.SecurityCode, card.CardType,
        card.Name, card.FirstName, card.Balance.Amount, card.Balance.Currency);
}
