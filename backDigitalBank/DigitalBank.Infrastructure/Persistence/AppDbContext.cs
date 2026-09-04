using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace DigitalBank.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<CardEntity> Cards => Set<CardEntity>();
    public DbSet<CardTransactionEntity> CardTransactions => Set<CardTransactionEntity>();
    public DbSet<CreditEntity> Credits => Set<CreditEntity>();
    public DbSet<PiggyBankEntity> PiggyBanks => Set<PiggyBankEntity>();
    public DbSet<DepositEntity> Deposits => Set<DepositEntity>();
    public DbSet<BondEntity> Bonds => Set<BondEntity>();
    public DbSet<BondOfferEntity> BondOffers => Set<BondOfferEntity>();
    public DbSet<InstallmentPlanEntity> InstallmentPlans => Set<InstallmentPlanEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
