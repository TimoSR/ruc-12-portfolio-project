using domain.profile.bookmarks;
using service_patterns;

namespace application.bookmarkService;

public class BookmarkService(IBookmarkRepository bookmarkRepository) : IBookmarkService
{
    public async Task<Result<Bookmark>> AddBookmarkAsync(Guid accountId, string targetId, string targetType, string? note, CancellationToken cancellationToken)
    {
        var existing = await bookmarkRepository.GetByUserAndTargetAsync(accountId, targetId, cancellationToken);
        if (existing != null)
        {
            return Result<Bookmark>.Success(existing); // Already bookmarked, idempotent success
        }

        try 
        {
            var bookmark = Bookmark.Create(accountId, targetId, targetType, note);
            await bookmarkRepository.AddAsync(bookmark, cancellationToken);
            return Result<Bookmark>.Success(bookmark);
        }
        catch (ArgumentException ex)
        {
            // Map domain exceptions to simple errors if needed
           return Result<Bookmark>.Failure(new Error("Bookmark.Invalid", ex.Message));
        }
    }

    public async Task<Result> RemoveBookmarkAsync(Guid accountId, string targetId, string targetType, CancellationToken cancellationToken)
    {
        var existing = await bookmarkRepository.GetByUserAndTargetAsync(accountId, targetId, cancellationToken);
        if (existing == null)
        {
            return Result.Failure(new Error("Bookmark.NotFound", "Bookmark not found"));
        }

        await bookmarkRepository.DeleteAsync(existing, cancellationToken);
        return Result.Success();
    }

    public async Task<Result<IEnumerable<Bookmark>>> GetUserBookmarksAsync(Guid accountId, CancellationToken cancellationToken)
    {
        var bookmarks = await bookmarkRepository.GetByAccountIdAsync(accountId, cancellationToken);
        return Result<IEnumerable<Bookmark>>.Success(bookmarks);
    }
}
