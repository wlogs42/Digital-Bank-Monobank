using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;

namespace DigitalBank.Application.Services;

public class CreateCardService
{
    private readonly ICardRepository _cardRepository;
    private readonly IUserRepository _userRepository;

    public CreateCardService(ICardRepository cardRepository, IUserRepository userRepository)
    {
        _cardRepository = cardRepository;
        _userRepository = userRepository;
    }

    public async Task<(Card? Card, string Error)> CreateAsync(
        int userId,
        string cardType,
        string name,
        string firstName,
        decimal initialAmount,
        Currency currency,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user is null)
            return (null, "User not found.");

        //var existingCard = await _cardRepository.GetByCardNumberAsync(cardNumber, cancellationToken);
        //if (existingCard is not null)
        //    return (null, "A card with this number already exists.");

        var (balance, balanceError) = Money.Create(initialAmount, currency);
        if (balance is null)
            return (null, balanceError);



        string cardNumber;
        do
        {
            cardNumber = CardNumberGenerator.GenerateCardNumber();
        }
        while(await _cardRepository.GetByCardNumberAsync(cardNumber,cancellationToken) is not null);

        var (card, error) = Card.Create(
            0, userId, cardNumber, 
            CardNumberGenerator.GenerateExpirationDate(),
            CardNumberGenerator.GenerateSecurityCode(), cardType, name, firstName, balance);


        if (card is null)
            return (null, error);

        var created = await _cardRepository.AddAsync(card, cancellationToken);
        return (created, string.Empty);
    }
}
