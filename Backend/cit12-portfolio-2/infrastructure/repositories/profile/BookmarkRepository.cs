using domain.profile.bookmarks;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.profile;

public class BookmarkRepository(MovieDbContext context) : IBookmarkRepository
{
    public async Task<Bookmark?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await context.Bookmarks
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Bookmark>> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken)
    {
        return await context.Bookmarks
            .Where(b => b.AccountId == accountId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Bookmark?> GetByUserAndTargetAsync(Guid accountId, Guid targetId, CancellationToken cancellationToken)
    {
        return await context.Bookmarks
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.AccountId == accountId && b.TargetId == targetId, cancellationToken);
    }

    public async Task AddAsync(Bookmark bookmark, CancellationToken cancellationToken)
    {
        // Using Raw SQL to bypass complex Enum Mapping issues with explicit casting
        var typeStr = bookmark.TargetType.ToString().ToLower();
        var noteJson = bookmark.Note == null ? null : System.Text.Json.JsonSerializer.Serialize(bookmark.Note);

        // We use string interpolation but EF Core parameterizes it safely. 
        // Crucially, we cast the typeStr to the enum type in Postgres.
        await context.Database.ExecuteSqlInterpolatedAsync($@"
            INSERT INTO profile.bookmark (id, account_id, target_id, target_type, note, added_at)
            VALUES ({bookmark.Id}, {bookmark.AccountId}, {bookmark.TargetId}, {typeStr}::public.bookmark_target, {noteJson}::jsonb, {bookmark.CreatedAt})", cancellationToken);
    }

    public async Task DeleteAsync(Bookmark bookmark, CancellationToken cancellationToken)
    {
        context.Bookmarks.Remove(bookmark);
        await context.SaveChangesAsync(cancellationToken);
    }
}
