using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipeRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"));

            migrationBuilder.AlterColumn<string>(
                name: "RecipePath",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.CreateTable(
                name: "RecipeRatings",
                columns: table => new
                {
                    RecipeRatingId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Rating = table.Column<int>(type: "INTEGER", nullable: true),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeRatings", x => x.RecipeRatingId);
                    table.ForeignKey(
                        name: "FK_RecipeRatings_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("b95c3b2f-6e03-44c0-bbf2-191cd9fa4df6"), "admin@knithub.no", "AQAAAAIAAYagAAAAEOmrVv+/LDUu8mxStm11OTtu1KJPlI964k103cz8hP7wFQEP9eqNUe5BEkFacVttyQ==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("b95c3b2f-6e03-44c0-bbf2-191cd9fa4df6"), new DateTime(2024, 5, 15, 14, 58, 33, 440, DateTimeKind.Local).AddTicks(1988), true, "Knithub Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_RecipeRatings_UserId",
                table: "RecipeRatings",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecipeRatings");

            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("b95c3b2f-6e03-44c0-bbf2-191cd9fa4df6"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("b95c3b2f-6e03-44c0-bbf2-191cd9fa4df6"));

            migrationBuilder.AlterColumn<string>(
                name: "RecipePath",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"), "admin@knithub.no", "AQAAAAIAAYagAAAAEIptBNtmjydTTmmse38vtyH+lsr+qFoj5oMxIskybBNwU8Q9qXv2cW13LPXa3AVGLg==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"), new DateTime(2024, 5, 6, 22, 4, 40, 804, DateTimeKind.Local).AddTicks(9100), true, "Knithub Admin" });
        }
    }
}
