using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class BondOfferConfiguration : IEntityTypeConfiguration<BondOfferEntity>
{
    public void Configure(EntityTypeBuilder<BondOfferEntity> builder)
    {
        builder.ToTable("BondOffers");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(o => o.RequiredAmount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(o => o.TermDays)
            .IsRequired();

        builder.Property(o => o.AnnualRatePercent)
            .HasColumnType("decimal(5,2)")
            .IsRequired();

        builder.HasData(
            new BondOfferEntity { Id = 1, Name = "ОВДП 3 місяці", RequiredAmount = 1000m, TermDays = 90, AnnualRatePercent = 15m },
            new BondOfferEntity { Id = 2, Name = "ОВДП 6 місяців", RequiredAmount = 2000m, TermDays = 180, AnnualRatePercent = 17m },
            new BondOfferEntity { Id = 3, Name = "ОВДП 12 місяців", RequiredAmount = 5000m, TermDays = 365, AnnualRatePercent = 19m }
        );
    }
}
