using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class DepositConfiguration : IEntityTypeConfiguration<DepositEntity>
{
    public void Configure(EntityTypeBuilder<DepositEntity> builder)
    {
        builder.ToTable("Deposits");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.PrincipalAmount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(d => d.Currency)
            .IsRequired();

        builder.Property(d => d.TermDays)
            .IsRequired();

        builder.Property(d => d.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(d => d.UserId);

        builder.HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<CardEntity>()
            .WithMany()
            .HasForeignKey(d => d.CardId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
