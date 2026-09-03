namespace DigitalBank.API.Contracts;

public record CardLookupResponse(string CardNumberMasked, string UserFirstName, string UserLastName);
