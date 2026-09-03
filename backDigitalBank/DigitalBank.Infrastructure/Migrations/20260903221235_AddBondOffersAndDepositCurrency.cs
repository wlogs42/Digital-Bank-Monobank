using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DigitalBank.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBondOffersAndDepositCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Currency",
                table: "Deposits",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "AnnualRatePercent",
                table: "Bonds",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "OfferId",
                table: "Bonds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OfferName",
                table: "Bonds",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "BondOffers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RequiredAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TermDays = table.Column<int>(type: "int", nullable: false),
                    AnnualRatePercent = table.Column<decimal>(type: "decimal(5,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BondOffers", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "BondOffers",
                columns: new[] { "Id", "AnnualRatePercent", "Name", "RequiredAmount", "TermDays" },
                values: new object[,]
                {
                    { 1, 15m, "ОВДП 3 місяці", 1000m, 90 },
                    { 2, 17m, "ОВДП 6 місяців", 2000m, 180 },
                    { 3, 19m, "ОВДП 12 місяців", 5000m, 365 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bonds_OfferId",
                table: "Bonds",
                column: "OfferId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bonds_BondOffers_OfferId",
                table: "Bonds",
                column: "OfferId",
                principalTable: "BondOffers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bonds_BondOffers_OfferId",
                table: "Bonds");

            migrationBuilder.DropTable(
                name: "BondOffers");

            migrationBuilder.DropIndex(
                name: "IX_Bonds_OfferId",
                table: "Bonds");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Deposits");

            migrationBuilder.DropColumn(
                name: "AnnualRatePercent",
                table: "Bonds");

            migrationBuilder.DropColumn(
                name: "OfferId",
                table: "Bonds");

            migrationBuilder.DropColumn(
                name: "OfferName",
                table: "Bonds");
        }
    }
}
