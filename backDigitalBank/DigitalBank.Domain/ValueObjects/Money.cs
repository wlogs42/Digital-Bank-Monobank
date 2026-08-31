namespace DigitalBank.Domain.ValueObjects;

public enum Currency
{
    UAH = 0,
    USD = 1,
    EUR = 2
}

public record Money
{
    private Money(decimal amount, Currency currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public decimal Amount { get; }
    public Currency Currency { get; }

    public static (Money? Money, string Error) Create(decimal amount, Currency currency)
    {
        if (amount < 0)
            return (null, "Amount can't be negative.");

        return (new Money(amount, currency), string.Empty);
    }

    public static (Money? Money, string Error) Zero(Currency currency) => Create(0, currency);
}
