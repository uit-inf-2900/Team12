using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class NeedlesNYarn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KnittingInventory");

            migrationBuilder.CreateTable(
                name: "NeedleInventory",
                columns: table => new
                {
                    ItemID = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Size = table.Column<int>(type: "INTEGER", nullable: false),
                    Length = table.Column<int>(type: "INTEGER", nullable: false),
                    NumItem = table.Column<int>(type: "INTEGER", nullable: false),
                    NumInUse = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NeedleInventory", x => x.ItemID);
                    table.ForeignKey(
                        name: "FK_NeedleInventory_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "YarnInventory",
                columns: table => new
                {
                    ItemID = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Manufacturer = table.Column<string>(type: "TEXT", nullable: false),
                    Weight = table.Column<int>(type: "INTEGER", nullable: false),
                    Length = table.Column<int>(type: "INTEGER", nullable: false),
                    Gauge = table.Column<string>(type: "TEXT", nullable: false),
                    NumItems = table.Column<int>(type: "INTEGER", nullable: false),
                    InUse = table.Column<int>(type: "INTEGER", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YarnInventory", x => x.ItemID);
                    table.ForeignKey(
                        name: "FK_YarnInventory_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NeedleInventory_UserId",
                table: "NeedleInventory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_YarnInventory_UserId",
                table: "YarnInventory",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NeedleInventory");

            migrationBuilder.DropTable(
                name: "YarnInventory");

            migrationBuilder.CreateTable(
                name: "KnittingInventory",
                columns: table => new
                {
                    ItemID = table.Column<Guid>(type: "TEXT", nullable: false),
                    Length = table.Column<int>(type: "INTEGER", nullable: false),
                    NumInUse = table.Column<int>(type: "INTEGER", nullable: false),
                    NumItem = table.Column<int>(type: "INTEGER", nullable: false),
                    Size = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KnittingInventory", x => x.ItemID);
                    table.ForeignKey(
                        name: "FK_KnittingInventory_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KnittingInventory_UserId",
                table: "KnittingInventory",
                column: "UserId");
        }
    }
}
