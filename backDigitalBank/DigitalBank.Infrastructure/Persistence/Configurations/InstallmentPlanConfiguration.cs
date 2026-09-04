using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class InstallmentPlanConfiguration : IEntityTypeConfiguration<InstallmentPlanEntity>
{
    public void Configure(EntityTypeBuilder<InstallmentPlanEntity> builder)
    {
        builder.ToTable("InstallmentPlans");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PrincipalAmount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.MonthsCount)
            .IsRequired();

        builder.Property(p => p.PaidInstallments)
            .IsRequired();

        builder.Property(p => p.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(p => p.UserId);

        builder.HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<CardEntity>()
            .WithMany()
            .HasForeignKey(p => p.CardId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
