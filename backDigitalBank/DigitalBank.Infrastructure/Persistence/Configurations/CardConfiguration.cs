using DigitalBank.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DigitalBank.Infrastructure.Persistence.Configurations;

public class CardConfiguration : IEntityTypeConfiguration<CardEntity>
{
    public void Configure(EntityTypeBuilder<CardEntity> builder)
    {
        builder.ToTable("Cards");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.CardNumber)
            .IsRequired()
            .HasMaxLength(16)
            .IsFixedLength();

        builder.HasIndex(c => c.CardNumber)
            .IsUnique();

        builder.Property(c => c.ExpirationDate)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(c => c.SecurityCode)
            .IsRequired()
            .HasMaxLength(4);

        builder.Property(c => c.CardType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.BalanceAmount)
            .HasColumnName("BalanceAmount")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(c => c.BalanceCurrency)
            .HasColumnName("BalanceCurrency")
            .IsRequired();

        builder.HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
