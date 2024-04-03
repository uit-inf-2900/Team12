using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProjectTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectTracking",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    KnittingRecipeId = table.Column<Guid>(type: "TEXT", nullable: true),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProsjectSize = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectRecipient = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectStatus = table.Column<string>(type: "TEXT", nullable: false),
                    ProjectStart = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ProjectEnd = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ProjectNotes = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectImagePath = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTracking", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_ProjectTracking_KnittingRecipes_KnittingRecipeId",
                        column: x => x.KnittingRecipeId,
                        principalTable: "KnittingRecipes",
                        principalColumn: "KnittingRecipeId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ProjectTracking_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTracking_KnittingRecipeId",
                table: "ProjectTracking",
                column: "KnittingRecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTracking_UserId",
                table: "ProjectTracking",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectTracking");
        }
    }
}
