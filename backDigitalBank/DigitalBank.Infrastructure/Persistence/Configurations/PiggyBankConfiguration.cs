using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class PiggyBankConfiguration : IEntityTypeConfiguration<PiggyBankEntity>
{
    public void Configure(EntityTypeBuilder<PiggyBankEntity> builder)
    {
        builder.ToTable("PiggyBanks");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.TargetAmount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.CurrentAmount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(p => p.UserId);

        builder.HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
