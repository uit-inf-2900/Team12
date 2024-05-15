using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Strikkeapp.Migrations
{
    /// <inheritdoc />
    public partial class FinishedDb : Migration
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
                    RecipePath = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    NeedleIds = table.Column<string>(type: "TEXT", nullable: true),
                    YarnIds = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectInventoryIds = table.Column<string>(type: "TEXT", nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProjectName = table.Column<string>(type: "TEXT", nullable: true)
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
                values: new object[] { new Guid("bce08d40-f0d0-4144-b51a-7730a5add11f"), "admin@knithub.no", "AQAAAAIAAYagAAAAELYaM5Ua97rcQ28zgOoEE1mEbCe1WW0DVMcoV2SgJ/upZbR+wO0rvt7BGDULm0Ja+w==", "verified", 999999 });

            migrationBuilder.InsertData(
                table: "UserDetails",
                columns: new[] { "UserId", "DateOfBirth", "IsAdmin", "UserFullName" },
                values: new object[] { new Guid("bce08d40-f0d0-4144-b51a-7730a5add11f"), new DateTime(2024, 5, 15, 17, 43, 4, 642, DateTimeKind.Local).AddTicks(8612), true, "Knithub Admin" });

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
                name: "IX_ProjectYarnInventory_UserId",
                table: "ProjectYarnInventory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UserId",
                table: "Projects",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeRatings_UserId",
                table: "RecipeRatings",
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
                name: "ProjectYarnInventory");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "RecipeRatings");

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
