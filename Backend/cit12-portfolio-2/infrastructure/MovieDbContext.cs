using domain.movie.person;
using domain.movie.title;
using domain.movie.titleRatings;
using domain.profile.account;
using domain.profile.accountRatings;
using domain.profile.bookmarks;
using domain.profile.searchHistory;
using domain.title;
using Microsoft.EntityFrameworkCore;
using service_patterns;

using System.Text.Json;

namespace infrastructure;

public class MovieDbContext(DbContextOptions<MovieDbContext> options) : DbContext(options)
{

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Title> Titles => Set<Title>();
    public DbSet<AccountRating> AccountRatings => Set<AccountRating>();
    public DbSet<TitleRating> TitleRatings => Set<TitleRating>();
    public DbSet<Person> Persons => Set<Person>();
    public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
    public DbSet<SearchHistory> SearchHistory => Set<SearchHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresEnum<BookmarkTarget>("public", "bookmark_target");
        modelBuilder.Ignore<DomainEvent>();

        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("account", "profile");
// ... check lines, keeping it minimal ...
// Actually, I can use replace_file_content to target the specific blocks.


            entity.ToTable("account", "profile");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Username).HasColumnName("username");
            entity.Property(e => e.Password).HasColumnName("password_hash");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });
        
        modelBuilder.Entity<AccountRating>(entity =>
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

        modelBuilder.Entity<Bookmark>(entity =>
        {
            entity.ToTable("bookmark", "profile");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.AccountId).HasColumnName("account_id");
            entity.Property(x => x.TargetId).HasColumnName("target_id");
            entity.Property(x => x.TargetType)
                .HasColumnName("target_type")
                .HasColumnType("public.bookmark_target")
                .HasConversion<string>(); // Force Enum <-> String conversion
            entity.Property(x => x.CreatedAt).HasColumnName("added_at");
            entity.Property(x => x.Note)
                .HasColumnName("note")
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<string>(v, (JsonSerializerOptions?)null));
        });

        modelBuilder.Entity<SearchHistory>(entity =>
        {
            entity.ToTable("search_history", "profile");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.AccountId).HasColumnName("account_id");
            entity.Property(x => x.Query).HasColumnName("search_query");
            entity.Property(x => x.Timestamp).HasColumnName("searched_at");
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
        
        modelBuilder.Entity<TitleRating>(entity =>
        {
            entity.ToTable("user_rating", "movie_db");

            entity.HasKey(x => new { x.AccountId, x.TitleId });

            entity.Property(x => x.AccountId).HasColumnName("account_id");
            entity.Property(x => x.TitleId).HasColumnName("title_id");
            entity.Property(x => x.Score).HasColumnName("rating");
        });

        modelBuilder.Entity<Person>(entity =>
        {
            entity.ToTable("person", "movie_db");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.LegacyId).HasColumnName("legacy_id");
            entity.Property(x => x.PrimaryName).HasColumnName("primary_name");
            entity.Property(x => x.BirthYear).HasColumnName("birth_year");
            entity.Property(x => x.DeathYear).HasColumnName("death_year");
        });
    }
}