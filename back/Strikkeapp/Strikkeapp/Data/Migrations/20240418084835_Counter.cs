using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class Counter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResponseMessage",
                table: "ContactRequests");

            migrationBuilder.CreateTable(
                name: "CounterInventory",
                columns: table => new
                {
                    CounterId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RoundNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CounterInventory", x => x.CounterId);
                    table.ForeignKey(
                        name: "FK_CounterInventory_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserVerification",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    VerificationCode = table.Column<string>(type: "TEXT", maxLength: 6, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVerification", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UserVerification_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CounterInventory_UserId",
                table: "CounterInventory",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CounterInventory");

            migrationBuilder.DropTable(
                name: "UserVerification");

            migrationBuilder.AddColumn<string>(
                name: "ResponseMessage",
                table: "ContactRequests",
                type: "TEXT",
                nullable: true);
        }
    }
}
