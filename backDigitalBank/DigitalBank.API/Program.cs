using DigitalBank.API;
using DigitalBank.API.Contracts;
using DigitalBank.Application.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapPost("/users", async (RegisterUserRequest request, RegisterUserService service, CancellationToken cancellationToken) =>
{
    var (user, error) = await service.RegisterAsync(
        request.UserName, request.UserFirstName, request.UserLastName,
        request.Password, request.Email, request.PhoneNumber, cancellationToken);

    return user is null
        ? Results.BadRequest(new { error })
        : Results.Ok(UserResponse.FromDomain(user));
});

app.MapPost("/login", async (LoginRequest request, LoginService service, CancellationToken cancellationToken) =>
{
    var (user, error) = await service.LoginAsync(request.Email, request.Password, cancellationToken);

    return user is null
        ? Results.Json(new { error }, statusCode: StatusCodes.Status401Unauthorized)
        : Results.Ok(UserResponse.FromDomain(user));
});

app.MapPost("/cards", async (CreateCardRequest request, CreateCardService service, CancellationToken cancellationToken) =>
{
    var (card, error) = await service.CreateAsync(
        request.UserId, request.CardNumber, request.ExpirationDate, request.SecurityCode,
        request.CardType, request.Name, request.FirstName, request.InitialAmount, request.Currency,
        cancellationToken);

    return card is null
        ? Results.BadRequest(new { error })
        : Results.Ok(CardResponse.FromDomain(card));
});

app.Run();
