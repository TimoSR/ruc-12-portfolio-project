using domain.profile.bookmark;
using service_patterns;

namespace application.bookmarkService;

public interface IBookmarkService
{
    Task<Result<Bookmark>> AddBookmarkAsync(Guid accountId, string targetId, string targetType, string? note, CancellationToken cancellationToken);
    Task<Result> RemoveBookmarkAsync(Guid accountId, string targetId, CancellationToken cancellationToken);
    Task<Result<IEnumerable<Bookmark>>> GetBookmarksAsync(Guid accountId, CancellationToken cancellationToken);
    Task<Result<bool>> IsBookmarkedAsync(Guid accountId, string targetId, CancellationToken cancellationToken);
}
