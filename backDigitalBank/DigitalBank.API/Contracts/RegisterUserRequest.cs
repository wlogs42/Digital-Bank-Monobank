namespace DigitalBank.API.Contracts;

public record RegisterUserRequest(
    string UserName,
    string UserFirstName,
    string UserLastName,
    string Password,
    string Email,
    string PhoneNumber);
