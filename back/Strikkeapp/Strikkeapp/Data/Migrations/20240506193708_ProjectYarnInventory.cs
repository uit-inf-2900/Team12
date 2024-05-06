using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProjectYarnInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"));

            migrationBuilder.AddColumn<string>(
                name: "ProjectInventoryIds",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProjectYarnInventory",
                columns: table => new
                {
                    ProjectInventoryId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ItemId = table.Column<Guid>(type: "TEXT", nullable: false),
                    NumberInUse = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectYarnInventory", x => x.ProjectInventoryId);
                    table.ForeignKey(
                        name: "FK_ProjectYarnInventory_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"), "admin@knithub.no", "AQAAAAIAAYagAAAAEGTCs8kIFEMACqIv3BVBr28+oV5JFdSqXWv9RnMJMYw4lVxhKwZC0HKzvLySHbtswA==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"), new DateTime(2024, 5, 6, 21, 37, 7, 608, DateTimeKind.Local).AddTicks(9650), true, "Knithub Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectYarnInventory_UserId",
                table: "ProjectYarnInventory",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectYarnInventory");

            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"));

            migrationBuilder.DropColumn(
                name: "ProjectInventoryIds",
                table: "Projects");

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"), "admin@knithub.no", "AQAAAAIAAYagAAAAEPOL2TGlbemVJUakbYxrBQP5UiH1r4Mz22xvX9nsP3smhMWfJctUI/Pt1VX9lRzz3g==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("b3616d88-501b-4395-a317-daf11f9a5fea"), new DateTime(2024, 5, 6, 9, 24, 59, 341, DateTimeKind.Local).AddTicks(3440), true, "Knithub Admin" });
        }
    }
}
