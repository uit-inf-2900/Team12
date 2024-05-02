using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class DefaultAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Newsletter",
                columns: table => new
                {
                    email = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Newsletter", x => x.email);
                });

            migrationBuilder.CreateTable(
                name: "UserLogIn",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserEmail = table.Column<string>(type: "TEXT", nullable: false),
                    UserPwd = table.Column<string>(type: "TEXT", nullable: false),
                    UserStatus = table.Column<string>(type: "TEXT", nullable: false),
                    UserVerificationCode = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogIn", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "ContactRequests",
                columns: table => new
                {
                    ContactRequestId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: true),
                    FullName = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    Message = table.Column<string>(type: "TEXT", nullable: true),
                    TimeCreated = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsHandled = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactRequests", x => x.ContactRequestId);
                    table.ForeignKey(
                        name: "FK_ContactRequests_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "KnittingRecipes",
                columns: table => new
                {
                    KnittingRecipeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RecipeName = table.Column<string>(type: "TEXT", nullable: false),
                    NeedleSize = table.Column<int>(type: "INTEGER", nullable: false),
                    KnittingGauge = table.Column<string>(type: "TEXT", nullable: false),
                    RecipePath = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KnittingRecipes", x => x.KnittingRecipeId);
                    table.ForeignKey(
                        name: "FK_KnittingRecipes_UserLogIn_UserId",
                        column: x => x.UserId,
                        principalTable: "UserLogIn",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "UserDetails",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserFullName = table.Column<string>(type: "TEXT", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsAdmin = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDetails", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UserDetails_UserLogIn_UserId",
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

            migrationBuilder.CreateTable(
                name: "YarnInventory",
                columns: table => new
                {
                    ItemID = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Manufacturer = table.Column<string>(type: "TEXT", nullable: false),
                    Color = table.Column<string>(type: "TEXT", nullable: false),
                    Batch_Number = table.Column<string>(type: "TEXT", nullable: true),
                    Weight = table.Column<int>(type: "INTEGER", nullable: true),
                    Length = table.Column<int>(type: "INTEGER", nullable: true),
                    Gauge = table.Column<string>(type: "TEXT", nullable: true),
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

            migrationBuilder.InsertData(
                table: "UserLogIn",
                columns: new[] { "UserId", "UserEmail", "UserPwd", "UserStatus", "UserVerificationCode" },
                values: new object[] { new Guid("ca5cb373-cb81-4f13-bd75-6a271f0af169"), "admin@knithub.no", "AQAAAAIAAYagAAAAEATZBdcB4rhIWkdMmC5V3idN5UXxsE+gto8rzx2C7D8Y+4inDaW1XiyCfSUm6oUhMQ==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("ca5cb373-cb81-4f13-bd75-6a271f0af169"), new DateTime(2024, 5, 1, 14, 12, 55, 957, DateTimeKind.Local).AddTicks(7022), true, "Knithub Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_UserId",
                table: "ContactRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CounterInventory_UserId",
                table: "CounterInventory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_KnittingRecipes_UserId",
                table: "KnittingRecipes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_NeedleInventory_UserId",
                table: "NeedleInventory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTracking_KnittingRecipeId",
                table: "ProjectTracking",
                column: "KnittingRecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTracking_UserId",
                table: "ProjectTracking",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogIn_UserEmail",
                table: "UserLogIn",
                column: "UserEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_YarnInventory_UserId",
                table: "YarnInventory",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactRequests");

            migrationBuilder.DropTable(
                name: "CounterInventory");

            migrationBuilder.DropTable(
                name: "NeedleInventory");

            migrationBuilder.DropTable(
                name: "Newsletter");

            migrationBuilder.DropTable(
                name: "ProjectTracking");

            migrationBuilder.DropTable(
                name: "UserDetails");

            migrationBuilder.DropTable(
                name: "UserVerification");

            migrationBuilder.DropTable(
                name: "YarnInventory");

            migrationBuilder.DropTable(
                name: "KnittingRecipes");

            migrationBuilder.DropTable(
                name: "UserLogIn");
        }
    }
}
