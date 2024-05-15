using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.IdentityModel.Tokens;
using Strikkeapp.Data.Entities;

namespace Strikkeapp.Data.Context;

public class StrikkeappDbContext : DbContext
{
    private readonly IPasswordHasher<object> _passwordHasher;
    public StrikkeappDbContext(DbContextOptions<StrikkeappDbContext> options,
        IPasswordHasher<object> passwordHasher)
        : base(options)
    {
        _passwordHasher = passwordHasher;
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
    public virtual DbSet<ProjectEntity> Projects { get; set; }
    public virtual DbSet<ProjectYarnInventoryEntity> ProjectYarnInventory { get; set; }


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

        modelBuilder.Entity<ProjectEntity>()
            .Property(p => p.NeedleIds)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null!),
                v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions)null!),
                    new ValueComparer<List<Guid>>(
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

        modelBuilder.Entity<ProjectEntity>()
            .Property(p => p.YarnIds)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null!),
                v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions)null!),
                    new ValueComparer<List<Guid>>(
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

        modelBuilder.Entity<ProjectEntity>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectYarnInventoryEntity>()
            .HasOne<UserLogIn>()
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);


        // Set default admin user
        Guid adminGuid = Guid.NewGuid();
        modelBuilder.Entity<UserLogIn>().HasData(
            new UserLogIn
            {
                UserId = adminGuid,
                UserEmail = "admin@knithub.no",
                UserPwd = _passwordHasher.HashPassword("admin@knithub.no", "KnithubAdminUser!"),
                UserStatus = "verified",
                UserVerificationCode = 999999
            });
        modelBuilder.Entity<UserDetails>().HasData(
            new UserDetails
            {
                UserId = adminGuid,
                UserFullName = "Knithub Admin",
                DateOfBirth = DateTime.Now,
                IsAdmin = true
            });

    }
}