using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProjectName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"));

            migrationBuilder.AddColumn<string>(
                name: "ProjectName",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"), "admin@knithub.no", "AQAAAAIAAYagAAAAEIptBNtmjydTTmmse38vtyH+lsr+qFoj5oMxIskybBNwU8Q9qXv2cW13LPXa3AVGLg==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"), new DateTime(2024, 5, 6, 22, 4, 40, 804, DateTimeKind.Local).AddTicks(9100), true, "Knithub Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserDetails",
                keyColumn: "UserId",
                keyValue: new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"));

            migrationBuilder.DeleteData(
                table: "UserLogIn",
                keyColumn: "UserId",
                keyValue: new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"));

            migrationBuilder.DropColumn(
                name: "ProjectName",
                table: "Projects");

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"), "admin@knithub.no", "AQAAAAIAAYagAAAAEGTCs8kIFEMACqIv3BVBr28+oV5JFdSqXWv9RnMJMYw4lVxhKwZC0HKzvLySHbtswA==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("b1712c25-2644-48a8-9d8e-f0de8ed299ff"), new DateTime(2024, 5, 6, 21, 37, 7, 608, DateTimeKind.Local).AddTicks(9650), true, "Knithub Admin" });
        }
    }
}
