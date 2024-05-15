﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Strikkeapp.Data.Context;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    [DbContext(typeof(StrikkeappDbContext))]
    partial class StrikkeappDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.3");

            modelBuilder.Entity("Strikkeapp.Data.Entities.ContactRequest", b =>
                {
                    b.Property<Guid>("ContactRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("FullName")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsActive")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsHandled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Message")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("TimeCreated")
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("ContactRequestId");

                    b.HasIndex("UserId");

                    b.ToTable("ContactRequests", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.Counter", b =>
                {
                    b.Property<Guid>("CounterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("RoundNumber")
                        .HasColumnType("INTEGER");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("CounterId");

                    b.HasIndex("UserId");

                    b.ToTable("CounterInventory", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.KnittingRecipes", b =>
                {
                    b.Property<Guid>("KnittingRecipeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("KnittingGauge")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("NeedleSize")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<string>("RecipeName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("RecipePath")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("KnittingRecipeId");

                    b.HasIndex("UserId");

                    b.ToTable("KnittingRecipes", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.NeedleInventory", b =>
                {
                    b.Property<Guid>("ItemID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<int>("Length")
                        .HasColumnType("INTEGER");

                    b.Property<int>("NumInUse")
                        .HasColumnType("INTEGER");

                    b.Property<int>("NumItem")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Size")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("ItemID");

                    b.HasIndex("UserId");

                    b.ToTable("NeedleInventory", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.Newsletter", b =>
                {
                    b.Property<string>("email")
                        .HasColumnType("TEXT");

                    b.HasKey("email");

                    b.ToTable("Newsletter", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.ProjectEntity", b =>
                {
                    b.Property<Guid>("ProjectId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("NeedleIds")
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectInventoryIds")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectName")
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("RecipeId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("YarnIds")
                        .HasColumnType("TEXT");

                    b.HasKey("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("Projects", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.ProjectTracking", b =>
                {
                    b.Property<Guid>("ProjectId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("KnittingRecipeId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("ProjectEnd")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectImagePath")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectNotes")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectRecipient")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("ProjectStart")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectStatus")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ProsjectSize")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("ProjectId");

                    b.HasIndex("KnittingRecipeId");

                    b.HasIndex("UserId");

                    b.ToTable("ProjectTracking", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.ProjectYarnInventoryEntity", b =>
                {
                    b.Property<Guid>("ProjectInventoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("ItemId")
                        .HasColumnType("TEXT");

                    b.Property<int>("NumberInUse")
                        .HasColumnType("INTEGER");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("ProjectInventoryId");

                    b.HasIndex("UserId");

                    b.ToTable("ProjectYarnInventory", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.UserDetails", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserFullName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.ToTable("UserDetails", (string)null);

                    b.HasData(
                        new
                        {
                            UserId = new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"),
                            DateOfBirth = new DateTime(2024, 5, 6, 22, 4, 40, 804, DateTimeKind.Local).AddTicks(9100),
                            IsAdmin = true,
                            UserFullName = "Knithub Admin"
                        });
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.UserLogIn", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserEmail")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserPwd")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserStatus")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("UserVerificationCode")
                        .HasColumnType("INTEGER");

                    b.HasKey("UserId");

                    b.HasIndex("UserEmail")
                        .IsUnique();

                    b.ToTable("UserLogIn", (string)null);

                    b.HasData(
                        new
                        {
                            UserId = new Guid("6fbe0ff0-1ac7-4852-ac3a-bb212f19fb61"),
                            UserEmail = "admin@knithub.no",
                            UserPwd = "AQAAAAIAAYagAAAAEIptBNtmjydTTmmse38vtyH+lsr+qFoj5oMxIskybBNwU8Q9qXv2cW13LPXa3AVGLg==",
                            UserStatus = "verified",
                            UserVerificationCode = 999999
                        });
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.UserVerification", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<string>("VerificationCode")
                        .IsRequired()
                        .HasMaxLength(6)
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.ToTable("UserVerification", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.YarnInventory", b =>
                {
                    b.Property<Guid>("ItemID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Batch_Number")
                        .HasColumnType("TEXT");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Gauge")
                        .HasColumnType("TEXT");

                    b.Property<int>("InUse")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Length")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Manufacturer")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<int>("NumItems")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<int?>("Weight")
                        .HasColumnType("INTEGER");

                    b.HasKey("ItemID");

                    b.HasIndex("UserId");

                    b.ToTable("YarnInventory", (string)null);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.ContactRequest", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.Counter", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.KnittingRecipes", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.NeedleInventory", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.ProjectEntity", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.ProjectTracking", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.KnittingRecipes", null)
                        .WithMany()
                        .HasForeignKey("KnittingRecipeId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.ProjectYarnInventoryEntity", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.UserDetails", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithOne()
                        .HasForeignKey("Strikkeapp.Data.Entities.UserDetails", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.UserVerification", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithOne()
                        .HasForeignKey("Strikkeapp.Data.Entities.UserVerification", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.YarnInventory", b =>
                {
                    b.HasOne("Strikkeapp.Data.Entities.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
