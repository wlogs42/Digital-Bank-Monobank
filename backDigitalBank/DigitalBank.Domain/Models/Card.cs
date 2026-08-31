using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Domain.Models;

public class Card
{
    private Card(
        int id,
        int userId,
        string cardNumber,
        string expirationDate,
        string securityCode,
        string cardType,
        string name,
        string firstName,
        Money balance)
    {
        Id = id;
        UserId = userId;
        CardNumber = cardNumber;
        ExpirationDate = expirationDate;
        SecurityCode = securityCode;
        CardType = cardType;
        Name = name;
        FirstName = firstName;
        Balance = balance;
    }

    public int Id { get; }
    public int UserId { get; }
    public string CardNumber { get; }
    public string ExpirationDate { get; }
    public string SecurityCode { get; }
    public string CardType { get; }
    public string Name { get; }
    public string FirstName { get; }
    public Money Balance { get; }

    public static (Card? Card, string Error) Create(
        int id,
        int userId,
        string cardNumber,
        string expirationDate,
        string securityCode,
        string cardType,
        string name,
        string firstName,
        Money balance)
    {
        if (string.IsNullOrWhiteSpace(cardNumber) || cardNumber.Length != 16)
            return (null, "Card number must be 16 digits.");

        if (string.IsNullOrWhiteSpace(expirationDate))
            return (null, "Expiration date can't be empty.");

        if (string.IsNullOrWhiteSpace(securityCode) || securityCode.Length is < 3 or > 4)
            return (null, "Security code must be 3 or 4 digits.");

        if (string.IsNullOrWhiteSpace(cardType))
            return (null, "Card type can't be empty.");

        if (string.IsNullOrWhiteSpace(name) || name.Length > 100)
            return (null, "Name can't be empty or longer than 100 characters.");

        if (string.IsNullOrWhiteSpace(firstName) || firstName.Length > 100)
            return (null, "First name can't be empty or longer than 100 characters.");

        if (balance is null)
            return (null, "Balance is required.");

        var card = new Card(
            id, userId, cardNumber, expirationDate,
            securityCode, cardType, name, firstName, balance
        );

        return (card, string.Empty);
    }
}
