using DigitalBank.API;
using DigitalBank.API.Contracts;
using DigitalBank.Application.Interfaces;
using DigitalBank.Application.Services;
using DigitalBank.Domain.Models;
using DigitalBank.Domain.ValueObjects;
using System.Threading;

const string FrontendCorsPolicy = "FrontendCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5199")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(FrontendCorsPolicy);

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
        request.UserId, request.CardType, request.Name, 
        request.FirstName, request.InitialAmount, request.Currency,
        cancellationToken);

    return card is null
        ? Results.BadRequest(new { error })
        : Results.Ok(CardResponse.FromDomain(card));
});

app.MapGet("/cards/user/{userId:int}", async (int userId, ICardRepository cardRepo, CancellationToken cancellationToken) =>
{
    var cards = await cardRepo.GetByUserIdAsync(userId, cancellationToken);
    return Results.Ok(cards.Select(CardResponse.FromDomain));
});

app.MapGet("/cards/lookup/{cardNumber}", async (string cardNumber, ICardRepository cardRepo, IUserRepository userRepo, CancellationToken cancellationToken) =>
{
    var card = await cardRepo.GetByCardNumberAsync(cardNumber, cancellationToken);
    if (card is null)
        return Results.NotFound(new { error = "Card not found." });

    var user = await userRepo.GetByIdAsync(card.UserId, cancellationToken);
    if (user is null)
        return Results.NotFound(new { error = "Card not found." });

    var masked = "**** **** **** " + card.CardNumber[^4..];
    return Results.Ok(new CardLookupResponse(masked, user.UserFirstName, user.UserLastName));
});

app.MapPost("/transfers", async (TransferRequest request, TransferService service, CancellationToken cancellationToken) =>
{
    var (transaction, error) = await service.TransferAsync(
        request.FromCardId, request.ToCardNumber, request.Amount, cancellationToken);

    return transaction is null
        ? Results.BadRequest(new { error })
        : Results.Ok(TransactionResponse.FromDomain(transaction));
});

app.MapGet("/cards/{cardId:int}/transactions", async (int cardId, ICardTransactionRepository transactionRepo, CancellationToken cancellationToken) =>
{
    var transactions = await transactionRepo.GetByCardIdAsync(cardId, cancellationToken);
    return Results.Ok(transactions.Select(TransactionResponse.FromDomain));
});

app.MapPost("/credits", async (TakeCreditRequest request, CreditService service, CancellationToken cancellationToken) =>
{
    var (credit, error) = await service.TakeCreditAsync(
        request.UserId, request.CardId, request.Amount, request.DueDate, cancellationToken);

    return credit is null
        ? Results.BadRequest(new { error })
        : Results.Ok(CreditResponse.FromDomain(credit));
});

app.MapGet("/credits/user/{userId:int}", async (int userId, ICreditRepository creditRepo, CancellationToken cancellationToken) =>
{
    var credits = await creditRepo.GetByUserIdAsync(userId, cancellationToken);
    return Results.Ok(credits.Select(CreditResponse.FromDomain));
});

app.MapPost("/credits/{creditId:int}/repay", async (int creditId, RepayCreditRequest request, CreditService service, CancellationToken cancellationToken) =>
{
    var (credit, error) = await service.RepayCreditAsync(creditId, request.CardId, cancellationToken);

    return credit is null
        ? Results.BadRequest(new { error })
        : Results.Ok(CreditResponse.FromDomain(credit));
});

app.MapPost("/piggy-banks", async (CreatePiggyBankRequest request, PiggyBankService service, CancellationToken cancellationToken) =>
{
    var (piggyBank, error) = await service.CreateAsync(request.UserId, request.Name, request.TargetAmount, cancellationToken);

    return piggyBank is null
        ? Results.BadRequest(new { error })
        : Results.Ok(PiggyBankResponse.FromDomain(piggyBank));
});

app.MapGet("/piggy-banks/user/{userId:int}", async (int userId, IPiggyBankRepository piggyBankRepo, CancellationToken cancellationToken) =>
{
    var piggyBanks = await piggyBankRepo.GetByUserIdAsync(userId, cancellationToken);
    return Results.Ok(piggyBanks.Select(PiggyBankResponse.FromDomain));
});

app.MapPost("/piggy-banks/{piggyBankId:int}/deposit", async (int piggyBankId, PiggyBankFundsRequest request, PiggyBankService service, CancellationToken cancellationToken) =>
{
    var (piggyBank, error) = await service.DepositAsync(request.UserId, piggyBankId, request.CardId, request.Amount, cancellationToken);

    return piggyBank is null
        ? Results.BadRequest(new { error })
        : Results.Ok(PiggyBankResponse.FromDomain(piggyBank));
});

app.MapPost("/piggy-banks/{piggyBankId:int}/withdraw", async (int piggyBankId, PiggyBankFundsRequest request, PiggyBankService service, CancellationToken cancellationToken) =>
{
    var (piggyBank, error) = await service.WithdrawAsync(request.UserId, piggyBankId, request.CardId, request.Amount, cancellationToken);

    return piggyBank is null
        ? Results.BadRequest(new { error })
        : Results.Ok(PiggyBankResponse.FromDomain(piggyBank));
});

app.MapGet("/deposits/rates", () =>
{
    var rates = Enum.GetValues<Currency>().Select(currency =>
    {
        var (maturityRate, earlyRate) = Deposit.GetRates(currency);
        return new { currency, maturityRatePercent = maturityRate, earlyRatePercent = earlyRate };
    });

    return Results.Ok(rates);
});

app.MapPost("/deposits", async (OpenDepositRequest request, DepositService service, CancellationToken cancellationToken) =>
{
    var (deposit, error) = await service.OpenAsync(
        request.UserId, request.CardId, request.Amount, request.TermDays, cancellationToken);

    return deposit is null
        ? Results.BadRequest(new { error })
        : Results.Ok(DepositResponse.FromDomain(deposit));
});

app.MapGet("/deposits/user/{userId:int}", async (int userId, IDepositRepository depositRepo, CancellationToken cancellationToken) =>
{
    var deposits = await depositRepo.GetByUserIdAsync(userId, cancellationToken);
    return Results.Ok(deposits.Select(DepositResponse.FromDomain));
});

app.MapPost("/deposits/{depositId:int}/withdraw", async (int depositId, WithdrawDepositRequest request, DepositService service, CancellationToken cancellationToken) =>
{
    var (deposit, error) = await service.WithdrawAsync(depositId, request.CardId, cancellationToken);

    return deposit is null
        ? Results.BadRequest(new { error })
        : Results.Ok(DepositResponse.FromDomain(deposit));
});

app.MapGet("/bond-offers", async (IBondOfferRepository offerRepo, CancellationToken cancellationToken) =>
{
    var offers = await offerRepo.GetAllAsync(cancellationToken);
    return Results.Ok(offers.Select(BondOfferResponse.FromDomain));
});

app.MapPost("/bonds", async (BuyBondRequest request, BondService service, CancellationToken cancellationToken) =>
{
    var (bond, error) = await service.BuyAsync(
        request.UserId, request.CardId, request.OfferId, cancellationToken);

    return bond is null
        ? Results.BadRequest(new { error })
        : Results.Ok(BondResponse.FromDomain(bond));
});

app.MapGet("/bonds/user/{userId:int}", async (int userId, IBondRepository bondRepo, CancellationToken cancellationToken) =>
{
    var bonds = await bondRepo.GetByUserIdAsync(userId, cancellationToken);
    return Results.Ok(bonds.Select(BondResponse.FromDomain));
});

app.MapPost("/bonds/{bondId:int}/redeem", async (int bondId, RedeemBondRequest request, BondService service, CancellationToken cancellationToken) =>
{
    var (bond, error) = await service.RedeemAsync(bondId, request.CardId, cancellationToken);

    return bond is null
        ? Results.BadRequest(new { error })
        : Results.Ok(BondResponse.FromDomain(bond));
});

app.Run();
