using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class BondConfiguration : IEntityTypeConfiguration<BondEntity>
{
    public void Configure(EntityTypeBuilder<BondEntity> builder)
    {
        builder.ToTable("Bonds");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.OfferName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.PrincipalAmount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(b => b.AnnualRatePercent)
            .HasColumnType("decimal(5,2)")
            .IsRequired();

        builder.Property(b => b.TermDays)
            .IsRequired();

        builder.Property(b => b.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(b => b.UserId);

        builder.HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<CardEntity>()
            .WithMany()
            .HasForeignKey(b => b.CardId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<BondOfferEntity>()
            .WithMany()
            .HasForeignKey(b => b.OfferId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
