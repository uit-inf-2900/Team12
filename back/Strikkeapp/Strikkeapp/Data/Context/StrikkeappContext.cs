using Microsoft.EntityFrameworkCore;
using Strikkeapp.Data.Entities;

namespace Strikkeapp.Data.Context;

public class StrikkeappDbContext : DbContext
{
    public StrikkeappDbContext(DbContextOptions<StrikkeappDbContext> options)
        : base(options)
    {
    }

    // Create tables
    public virtual DbSet<UserLogIn> UserLogIn { get; set; }
    public virtual DbSet<UserDetails> UserDetails { get; set; }
    public virtual DbSet<KnittingRecipes> KnittingRecipes { get; set; }
    public virtual DbSet<ContactRequest> ContactRequests { get; set; }
    public virtual DbSet<ProjectTracking> ProjectTracking { get; set; }
    public virtual DbSet<NeedleInventory> NeedleInventory { get; set; }
    public virtual DbSet<YarnInventory> YarnInventory { get; set; }
    public virtual DbSet<UserVerification> UserVerification { get; set; }
    public virtual DbSet<Counter> CounterInventory { get; set; }
    public virtual DbSet<Newsletter> Newsletter { get; set; }


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
            .HasForeignKey<UserDetails>(ud => ud.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // User can have multiple recipes
        modelBuilder.Entity<KnittingRecipes>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(kr => kr.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Set up a relation between users and conversations (and delete all if user is deleted) 
        modelBuilder.Entity<ContactRequest>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(kr => kr.UserId)
            .OnDelete(DeleteBehavior.Cascade); 

        // User can have multiple projects with same recipe
        modelBuilder.Entity<ProjectTracking>()
            .HasOne<KnittingRecipes>()
            .WithMany()
            .HasForeignKey(pt => pt.KnittingRecipeId)
            .OnDelete(DeleteBehavior.SetNull);

        // Add forignkey and delete behaviour
        modelBuilder.Entity<ProjectTracking>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(pt => pt.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Add forignkey and delete behaviour
        modelBuilder.Entity<NeedleInventory>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(ni => ni.UserId)
            .IsRequired()
            .OnDelete (DeleteBehavior.Cascade);

        // Add forignkey and delete behaviour
        modelBuilder.Entity<YarnInventory>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(yi => yi.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Add forignkey and delete behaviour
        modelBuilder.Entity<UserVerification>()
            .HasOne<UserLogIn>()
            .WithOne()
            .HasForeignKey<UserVerification>(uv => uv.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Add forignkey and delete behaviour
        modelBuilder.Entity<Counter>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}