using domain.account;
using domain.title;
using Microsoft.EntityFrameworkCore;
using service_patterns;

namespace infrastructure;

public class MovieDbContext (DbContextOptions<MovieDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Title> Titles => Set<Title>();

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

        modelBuilder.Entity<Title>(entity =>
        {
            entity.ToTable("title", "movie_db");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LegacyId).HasColumnName("legacy_id");
            entity.Property(e => e.TitleType).HasColumnName("title_type");
            entity.Property(e => e.PrimaryTitle).HasColumnName("primary_title");
            entity.Property(e => e.OriginalTitle).HasColumnName("original_title");
            entity.Property(e => e.IsAdult).HasColumnName("is_adult");
            entity.Property(e => e.StartYear).HasColumnName("start_year");
            entity.Property(e => e.EndYear).HasColumnName("end_year");
            entity.Property(e => e.RuntimeMinutes).HasColumnName("runtime_minutes");
            entity.Property(e => e.PosterUrl).HasColumnName("poster_url");
            entity.Property(e => e.Plot).HasColumnName("plot");
        });
    }
}