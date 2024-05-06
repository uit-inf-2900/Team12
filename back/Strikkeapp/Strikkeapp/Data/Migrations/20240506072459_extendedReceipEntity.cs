using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class extendedReceipEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("7b8fe2d6-c9e3-4f52-ab9b-20858723a359"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("7b8fe2d6-c9e3-4f52-ab9b-20858723a359"));

            migrationBuilder.AlterColumn<string>(
                name: "RecipePath",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"), "admin@knithub.no", "AQAAAAIAAYagAAAAEPOL2TGlbemVJUakbYxrBQP5UiH1r4Mz22xvX9nsP3smhMWfJctUI/Pt1VX9lRzz3g==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"), new DateTime(2024, 5, 6, 9, 24, 59, 341, DateTimeKind.Local).AddTicks(3440), true, "Knithub Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"));

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "KnittingRecipes");

            migrationBuilder.AlterColumn<string>(
                name: "RecipePath",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("7b8fe2d6-c9e3-4f52-ab9b-20858723a359"), "admin@knithub.no", "AQAAAAIAAYagAAAAEPa42+iw8bfII1SnYZ0jL8KF3ZTO6tg7HDhqcBEbBSaaiDgh2QUISpqazzYIcpPjbA==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("7b8fe2d6-c9e3-4f52-ab9b-20858723a359"), new DateTime(2024, 5, 5, 22, 6, 48, 84, DateTimeKind.Local).AddTicks(2790), true, "Knithub Admin" });
        }
    }
}
