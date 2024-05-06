using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class Projects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("ca5cb373-cb81-4f13-bd75-6a271f0af169"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("ca5cb373-cb81-4f13-bd75-6a271f0af169"));

            migrationBuilder.AlterColumn<string>(
                name: "RecipePath",
                table: "KnittingRecipes",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    NeedleIds = table.Column<string>(type: "TEXT", nullable: true),
                    YarnIds = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_Projects_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("7b8fe2d6-c9e3-4f52-ab9b-20858723a359"), "admin@knithub.no", "AQAAAAIAAYagAAAAEPa42+iw8bfII1SnYZ0jL8KF3ZTO6tg7HDhqcBEbBSaaiDgh2QUISpqazzYIcpPjbA==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("7b8fe2d6-c9e3-4f52-ab9b-20858723a359"), new DateTime(2024, 5, 5, 22, 6, 48, 84, DateTimeKind.Local).AddTicks(2790), true, "Knithub Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UserId",
                table: "Projects",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");

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

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("ca5cb373-cb81-4f13-bd75-6a271f0af169"), "admin@knithub.no", "AQAAAAIAAYagAAAAEATZBdcB4rhIWkdMmC5V3idN5UXxsE+gto8rzx2C7D8Y+4inDaW1XiyCfSUm6oUhMQ==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("ca5cb373-cb81-4f13-bd75-6a271f0af169"), new DateTime(2024, 5, 1, 14, 12, 55, 957, DateTimeKind.Local).AddTicks(7022), true, "Knithub Admin" });
        }
    }
}
