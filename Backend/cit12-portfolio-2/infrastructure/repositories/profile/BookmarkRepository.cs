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
        await context.Bookmarks.AddAsync(bookmark, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Bookmark bookmark, CancellationToken cancellationToken)
    {
        context.Bookmarks.Remove(bookmark);
        await context.SaveChangesAsync(cancellationToken);
    }
}
