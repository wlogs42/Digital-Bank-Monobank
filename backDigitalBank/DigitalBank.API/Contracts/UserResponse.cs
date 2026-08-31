using DigitalBank.Domain.Models;

namespace DigitalBank.API.Contracts;

public record UserResponse(
    int Id,
    string UserName,
    string UserFirstName,
    string UserLastName,
    string Email,
    string PhoneNumber)
{
    public static UserResponse FromDomain(User user) => new(
        user.Id, user.UserName, user.UserFirstName, user.UserLastName,
        user.Email, user.PhoneNumber);
}
