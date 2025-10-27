using domain.account;
using domain.ratings;
using Microsoft.EntityFrameworkCore;
using service_patterns;

namespace infrastructure;

public class MovieDbContext (DbContextOptions<MovieDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Rating> Ratings => Set<Rating>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Ignore<DomainEvent>();
        
        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("account", "profile");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Username).HasColumnName("username");
            entity.Property(e => e.Password).HasColumnName("password_hash");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });
        
        modelBuilder.Entity<Rating>(entity =>
        {
            entity.ToTable("rating_history", "profile");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.AccountId).HasColumnName("account_id");
            entity.Property(x => x.TitleId).HasColumnName("title_id");
            entity.Property(x => x.Score).HasColumnName("rating");
            entity.Property(x => x.Comment).HasColumnName("comment");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
        });
    }
}