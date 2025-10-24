using domain.account;
using Microsoft.EntityFrameworkCore;
using service_patterns;

namespace infrastructure;

public class MovieDbContext (DbContextOptions<MovieDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();

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
    }
}