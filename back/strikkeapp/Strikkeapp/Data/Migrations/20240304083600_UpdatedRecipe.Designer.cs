﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Strikkeapp.Data.Models;

#nullable disable

namespace Strikkeapp.Data.Migrations
{
    [DbContext(typeof(StrikkeappDbContext))]
    [Migration("20240304083600_UpdatedRecipe")]
    partial class UpdatedRecipe
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.2");

            modelBuilder.Entity("Strikkeapp.Data.Models.KnittingRecipes", b =>
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

            modelBuilder.Entity("Strikkeapp.Data.Models.UserDetails", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserFullName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserType")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.ToTable("UserDetails");
                });

            modelBuilder.Entity("Strikkeapp.Data.Models.UserLogIn", b =>
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

            modelBuilder.Entity("Strikkeapp.Data.Models.KnittingRecipes", b =>
                {
                    b.HasOne("Strikkeapp.Data.Models.UserLogIn", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Strikkeapp.Data.Models.UserDetails", b =>
                {
                    b.HasOne("Strikkeapp.Data.Models.UserLogIn", null)
                        .WithOne()
                        .HasForeignKey("Strikkeapp.Data.Models.UserDetails", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
