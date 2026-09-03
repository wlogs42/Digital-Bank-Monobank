using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class CreditConfiguration : IEntityTypeConfiguration<CreditEntity>
{
    public void Configure(EntityTypeBuilder<CreditEntity> builder)
    {
        builder.ToTable("Credits");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.PrincipalAmount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(c => c.DueDate)
            .IsRequired();

        builder.Property(c => c.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(c => c.UserId);

        builder.HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<CardEntity>()
            .WithMany()
            .HasForeignKey(c => c.CardId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
