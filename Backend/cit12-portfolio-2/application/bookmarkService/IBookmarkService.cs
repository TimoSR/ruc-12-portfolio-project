using domain.profile.bookmarks;
using service_patterns;

namespace application.bookmarkService;

public interface IBookmarkService
{
    Task<Result<Bookmark>> AddBookmarkAsync(Guid accountId, string targetId, string targetType, string? note, CancellationToken cancellationToken);
    Task<Result> RemoveBookmarkAsync(Guid accountId, string targetId, string targetType, CancellationToken cancellationToken);
    Task<Result<IEnumerable<BookmarkDto>>> GetUserBookmarksAsync(Guid accountId, CancellationToken cancellationToken);
}
