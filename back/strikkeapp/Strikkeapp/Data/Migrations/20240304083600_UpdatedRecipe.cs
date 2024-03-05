using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedRecipe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecipePDF",
                table: "KnittingRecipes");

            migrationBuilder.AddColumn<string>(
                name: "KnittingGauge",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "NeedleSize",
                table: "KnittingRecipes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RecipeName",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipePath",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KnittingGauge",
                table: "KnittingRecipes");

            migrationBuilder.DropColumn(
                name: "NeedleSize",
                table: "KnittingRecipes");

            migrationBuilder.DropColumn(
                name: "RecipeName",
                table: "KnittingRecipes");

            migrationBuilder.DropColumn(
                name: "RecipePath",
                table: "KnittingRecipes");

            migrationBuilder.AddColumn<byte[]>(
                name: "RecipePDF",
                table: "KnittingRecipes",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
