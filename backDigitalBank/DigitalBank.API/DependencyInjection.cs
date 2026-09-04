using DigitalBank.Application.Interfaces;
using DigitalBank.Application.Services;
using DigitalBank.Infrastructure.Persistence;
using DigitalBank.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DigitalBank.API;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICardRepository, CardRepository>();
        services.AddScoped<ICardTransactionRepository, CardTransactionRepository>();
        services.AddScoped<ICreditRepository, CreditRepository>();
        services.AddScoped<IPiggyBankRepository, PiggyBankRepository>();
        services.AddScoped<IDepositRepository, DepositRepository>();
        services.AddScoped<IBondRepository, BondRepository>();
        services.AddScoped<IBondOfferRepository, BondOfferRepository>();
        services.AddScoped<IInstallmentPlanRepository, InstallmentPlanRepository>();

        services.AddScoped<RegisterUserService>();
        services.AddScoped<LoginService>();
        services.AddScoped<CreateCardService>();
        services.AddScoped<TransferService>();
        services.AddScoped<CreditService>();
        services.AddScoped<PiggyBankService>();
        services.AddScoped<DepositService>();
        services.AddScoped<BondService>();
        services.AddScoped<InstallmentPlanService>();

        return services;
    }
}
