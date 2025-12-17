using domain.profile.bookmark;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.profile;

public class BookmarkRepository : IBookmarkRepository
{
    private readonly MovieDbContext _context;

    public BookmarkRepository(MovieDbContext context)
    {
        _context = context;
    }

    public async Task<Bookmark?> GetAsync(Guid accountId, string targetId, CancellationToken cancellationToken)
    {
        return await _context.Bookmarks
            .FirstOrDefaultAsync(b => b.AccountId == accountId && b.TargetId == targetId, cancellationToken);
    }

    public async Task<IEnumerable<Bookmark>> GetAllAsync(Guid accountId, CancellationToken cancellationToken)
    {
        return await _context.Bookmarks
            .Where(b => b.AccountId == accountId)
            .OrderByDescending(b => b.AddedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Bookmark bookmark, CancellationToken cancellationToken)
    {
        await _context.Bookmarks.AddAsync(bookmark, cancellationToken);
    }

    public async Task DeleteAsync(Bookmark bookmark, CancellationToken cancellationToken)
    {
        _context.Bookmarks.Remove(bookmark);
        await Task.CompletedTask;
    }
}
