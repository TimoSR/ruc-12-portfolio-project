using domain.profile.bookmark;
using infrastructure;
using service_patterns;

namespace application.bookmarkService;

public class BookmarkService : IBookmarkService
{
    private readonly IBookmarkRepository _bookmarkRepository;
    private readonly IUnitOfWork _unitOfWork;

    public BookmarkService(IBookmarkRepository bookmarkRepository, IUnitOfWork unitOfWork)
    {
        _bookmarkRepository = bookmarkRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Bookmark>> AddBookmarkAsync(Guid accountId, string targetId, string targetType, string? note, CancellationToken cancellationToken)
    {
        var existing = await _bookmarkRepository.GetAsync(accountId, targetId, cancellationToken);
        if (existing != null)
        {
            return Result<Bookmark>.Success(existing); // Already exists, idempotent
        }

        var bookmark = new Bookmark
        {
            Id = Guid.NewGuid(),
            AccountId = accountId,
            TargetId = targetId,
            TargetType = targetType,
            Note = note,
            AddedAt = DateTime.UtcNow
        };

        await _bookmarkRepository.AddAsync(bookmark, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Bookmark>.Success(bookmark);
    }

    public async Task<Result> RemoveBookmarkAsync(Guid accountId, string targetId, CancellationToken cancellationToken)
    {
        var existing = await _bookmarkRepository.GetAsync(accountId, targetId, cancellationToken);
        if (existing == null)
        {
            return Result.Success(); // Already removed, idempotent
        }

        await _bookmarkRepository.DeleteAsync(existing, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result<IEnumerable<Bookmark>>> GetBookmarksAsync(Guid accountId, CancellationToken cancellationToken)
    {
        var bookmarks = await _bookmarkRepository.GetAllAsync(accountId, cancellationToken);
        return Result<IEnumerable<Bookmark>>.Success(bookmarks);
    }

    public async Task<Result<bool>> IsBookmarkedAsync(Guid accountId, string targetId, CancellationToken cancellationToken)
    {
        var existing = await _bookmarkRepository.GetAsync(accountId, targetId, cancellationToken);
        return Result<bool>.Success(existing != null);
    }
}
