using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class UserVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserVerification");
        }
    }
}
