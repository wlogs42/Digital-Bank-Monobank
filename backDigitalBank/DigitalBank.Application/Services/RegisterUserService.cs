using DigitalBank.Application.Interfaces;
using DigitalBank.Domain.Models;

namespace DigitalBank.Application.Services;

public class RegisterUserService
{
    private readonly IUserRepository _userRepository;

    public RegisterUserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<(User? User, string Error)> RegisterAsync(
        string userName,
        string userFirstName,
        string userLastName,
        string password,
        string email,
        string phoneNumber,
        CancellationToken cancellationToken = default)
    {
        if (!IsPasswordStrong(password, out var passwordError))
            return (null, passwordError);

        var existingEmail = await _userRepository.GetByEmailAsync(email, cancellationToken);
        if (existingEmail is not null)
            return (null, "A user with this email already exists.");

        var existingUserName = await _userRepository.GetByUserNameAsync(userName, cancellationToken);
        if (existingUserName is not null)
            return (null, "This username is already taken.");

        var passwordHash = PasswordHasher.Hash(password);

        var (user, error) = User.Create(
            0, userName, userFirstName, userLastName,
            passwordHash, email, phoneNumber);

        if (user is null)
            return (null, error);

        var created = await _userRepository.AddAsync(user, cancellationToken);
        return (created, string.Empty);
    }

    private static bool IsPasswordStrong(string password, out string error)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
        {
            error = "Password must be at least 8 characters.";
            return false;
        }

        if (!password.Any(char.IsUpper))
        {
            error = "Password must contain at least one uppercase letter.";
            return false;
        }

        if (!password.Any(char.IsLower))
        {
            error = "Password must contain at least one lowercase letter.";
            return false;
        }

        if (!password.Any(char.IsDigit))
        {
            error = "Password must contain at least one digit.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}
