﻿using Microsoft.EntityFrameworkCore;

namespace Strikkeapp.Data.Models
{
    public class StrikkeappDbContext : DbContext
    {
        public StrikkeappDbContext(DbContextOptions<StrikkeappDbContext> options)
            : base(options)
        {
        }

        // Create tables
        public DbSet<UserLogIn> UserLogIn { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure unique UserEmail
            modelBuilder.Entity<UserLogIn>()
                .HasIndex(u => u.UserEmail)
                .IsUnique();

            // Configure forign key
            modelBuilder.Entity<UserDetails>()
                .HasOne<UserLogIn>()
                .WithOne()
                .HasForeignKey<UserDetails>(ud => ud.UserId);
        }
    }
}
