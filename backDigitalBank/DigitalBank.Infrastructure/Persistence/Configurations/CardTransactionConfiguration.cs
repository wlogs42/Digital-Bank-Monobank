using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class CardTransactionConfiguration : IEntityTypeConfiguration<CardTransactionEntity>
{
    public void Configure(EntityTypeBuilder<CardTransactionEntity> builder)
    {
        builder.ToTable("CardTransactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(t => t.Currency)
            .IsRequired();

        builder.Property(t => t.CreatedAtUtc)
            .IsRequired();

        builder.HasIndex(t => t.FromCardId);
        builder.HasIndex(t => t.ToCardId);

        builder.HasOne<CardEntity>()
            .WithMany()
            .HasForeignKey(t => t.FromCardId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<CardEntity>()
            .WithMany()
            .HasForeignKey(t => t.ToCardId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
