using domain.profile.bookmarks;
using service_patterns;
using infrastructure;

namespace application.bookmarkService;

public class BookmarkService(IBookmarkRepository bookmarkRepository, IUnitOfWork unitOfWork) : IBookmarkService
{
    public async Task<Result<Bookmark>> AddBookmarkAsync(Guid accountId, string targetId, string targetType, string? note, CancellationToken cancellationToken)
    {
        // EPC: Bridge - Resolve string ID to Guid
        Guid internalTargetId;
        
        if (targetType == "movie")
        {
            var title = await unitOfWork.TitleRepository.GetByLegacyIdAsync(targetId, cancellationToken);
            if (title == null) return Result<Bookmark>.Failure(new Error("Bookmark.InvalidTarget", "Title not found"));
            internalTargetId = title.Id;
        }
        else if (targetType == "person")
        {
            var person = await unitOfWork.PersonRepository.GetByLegacyIdAsync(targetId, cancellationToken);
            if (person == null) return Result<Bookmark>.Failure(new Error("Bookmark.InvalidTarget", "Person not found"));
            internalTargetId = person.Id;
        }
        else
        {
            return Result<Bookmark>.Failure(new Error("Bookmark.InvalidType", "Invalid target type"));
        }

        var existing = await bookmarkRepository.GetByUserAndTargetAsync(accountId, internalTargetId, cancellationToken);
        if (existing != null)
        {
            return Result<Bookmark>.Success(existing); // Already bookmarked, idempotent success
        }

        try 
        {
            var bookmark = Bookmark.Create(accountId, internalTargetId, targetType, note);
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
        // EPC: Bridge - Resolve string ID to Guid
        Guid internalTargetId;
        if (targetType == "movie")
        {
             var title = await unitOfWork.TitleRepository.GetByLegacyIdAsync(targetId, cancellationToken);
             if (title == null) return Result.Failure(new Error("Bookmark.NotFound", "Target not found"));
             internalTargetId = title.Id;
        }
        else if (targetType == "person")
        {
             var person = await unitOfWork.PersonRepository.GetByLegacyIdAsync(targetId, cancellationToken);
             if (person == null) return Result.Failure(new Error("Bookmark.NotFound", "Target not found"));
             internalTargetId = person.Id;
        }
        else return Result.Failure(new Error("Bookmark.InvalidType", "Invalid type"));

        var existing = await bookmarkRepository.GetByUserAndTargetAsync(accountId, internalTargetId, cancellationToken);
        if (existing == null)
        {
            return Result.Failure(new Error("Bookmark.NotFound", "Bookmark not found"));
        }

        await bookmarkRepository.DeleteAsync(existing, cancellationToken);
        return Result.Success();
    }

    public async Task<Result<IEnumerable<BookmarkDto>>> GetUserBookmarksAsync(Guid accountId, CancellationToken cancellationToken)
    {
        var bookmarks = await bookmarkRepository.GetByAccountIdAsync(accountId, cancellationToken);
        var dtos = new List<BookmarkDto>();

        foreach (var bm in bookmarks)
        {
            string legacyId = bm.TargetId.ToString(); // Default fallback
            
            // EPC: Bridge - Lookup LegacyId
            if (bm.TargetType == "movie")
            {
               var title = await unitOfWork.TitleRepository.GetByIdAsync(bm.TargetId, cancellationToken);
               if (title != null) legacyId = title.LegacyId ?? legacyId;
            }
            else if (bm.TargetType == "person")
            {
               var person = await unitOfWork.PersonRepository.GetByIdAsync(bm.TargetId, cancellationToken);
               if (person != null) legacyId = person.LegacyId;
            }

            dtos.Add(new BookmarkDto(bm.Id, legacyId, bm.TargetType, bm.Note, bm.CreatedAt));
        }

        return Result<IEnumerable<BookmarkDto>>.Success(dtos);
    }
}
