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
            modelBuilder.HasAnnotation("ProductVersion", "8.0.2");

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

                    b.HasKey("ContactRequestId");

                    b.ToTable("ContactRequests");
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

                    b.ToTable("KnittingRecipes");
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

                    b.ToTable("UserDetails");
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

                    b.HasKey("UserId");

                    b.HasIndex("UserEmail")
                        .IsUnique();

                    b.ToTable("UserLogIn");
                });

            modelBuilder.Entity("Strikkeapp.Data.Entities.KnittingRecipes", b =>
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
#pragma warning restore 612, 618
        }
    }
}
