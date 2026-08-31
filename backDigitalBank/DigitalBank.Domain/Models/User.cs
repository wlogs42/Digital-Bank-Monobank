using System.Text.RegularExpressions;

namespace DigitalBank.Domain.Models;

public class User
{
    private static readonly Regex EmailRegex = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

    private User(
        int id,
        string userName,
        string userFirstName,
        string userLastName,
        string password,
        string email,
        string phoneNumber)
    {
        Id = id;
        UserName = userName;
        UserFirstName = userFirstName;
        UserLastName = userLastName;
        Password = password;
        Email = email;
        PhoneNumber = phoneNumber;
    }

    public int Id { get; }
    public string UserName { get; }
    public string UserFirstName { get; }
    public string UserLastName { get; }
    public string Password { get; }
    public string Email { get; }
    public string PhoneNumber { get; }

    public static (User? User, string Error) Create(
        int id,
        string userName,
        string userFirstName,
        string userLastName,
        string password,
        string email,
        string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(userName) || userName.Length > 100)
            return (null, "Username can't be empty or longer than 100 characters.");

        if (string.IsNullOrWhiteSpace(userFirstName) || userFirstName.Length > 100)
            return (null, "First name can't be empty or longer than 100 characters.");

        if (string.IsNullOrWhiteSpace(userLastName) || userLastName.Length > 100)
            return (null, "Last name can't be empty or longer than 100 characters.");

        if (string.IsNullOrWhiteSpace(password))
            return (null, "Password can't be empty.");

        if (string.IsNullOrWhiteSpace(email) || !EmailRegex.IsMatch(email))
            return (null, "Invalid email address.");

        if (string.IsNullOrWhiteSpace(phoneNumber))
            return (null, "Phone number can't be empty.");

        var user = new User(
            id, userName, userFirstName, userLastName,
            password, email, phoneNumber
        );

        return (user, string.Empty);
    }
}
