using domain.profile.bookmarks;
using service_patterns;
using infrastructure;

namespace application.bookmarkService;

public class BookmarkService(IBookmarkRepository bookmarkRepository, IUnitOfWork unitOfWork) : IBookmarkService
{
    public async Task<Result<Bookmark>> AddBookmarkAsync(Guid accountId, string targetId, string targetType, string? note, CancellationToken cancellationToken)
    {
        try 
        {
            // EPC: Bridge - Resolve string ID to Guid
            Guid internalTargetId;
            
            BookmarkTarget typeEnum;
            if (targetType == "movie")
            {
                var title = await unitOfWork.TitleRepository.GetByLegacyIdAsync(targetId, cancellationToken);
                if (title == null) return Result<Bookmark>.Failure(new Error("Bookmark.InvalidTarget", $"Title not found for {targetId}"));
                internalTargetId = title.Id;
                typeEnum = BookmarkTarget.title;
            }
            else if (targetType == "person")
            {
                var person = await unitOfWork.PersonRepository.GetByLegacyIdAsync(targetId, cancellationToken);
                if (person == null) return Result<Bookmark>.Failure(new Error("Bookmark.InvalidTarget", $"Person not found for {targetId}"));
                internalTargetId = person.Id;
                typeEnum = BookmarkTarget.person;
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

            var bookmark = Bookmark.Create(accountId, internalTargetId, typeEnum, note);
            await bookmarkRepository.AddAsync(bookmark, cancellationToken);
            return Result<Bookmark>.Success(bookmark);
        }
        catch (Exception ex)
        {
             Console.WriteLine($"[AddBookmarkAsync Error] {ex}");
             return Result<Bookmark>.Failure(new Error("Bookmark.Exception", ex.InnerException?.Message ?? ex.Message));
        }
    }

    public async Task<Result> RemoveBookmarkAsync(Guid accountId, string targetId, string targetType, CancellationToken cancellationToken)
    {
        try
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
        catch (Exception ex)
        {
             Console.WriteLine($"[RemoveBookmarkAsync Error] {ex}");
             return Result.Failure(new Error("Bookmark.Exception", ex.InnerException?.Message ?? ex.Message));
        }
    }

    public async Task<Result<IEnumerable<BookmarkDto>>> GetUserBookmarksAsync(Guid accountId, CancellationToken cancellationToken)
    {
        try
        {
            var bookmarks = await bookmarkRepository.GetByAccountIdAsync(accountId, cancellationToken);
            var dtos = new List<BookmarkDto>();
    
            foreach (var bm in bookmarks)
            {
                string legacyId = bm.TargetId.ToString(); // Default fallback
                
                // EPC: Bridge - Lookup LegacyId
                // EPC: Bridge - Lookup LegacyId
                string typeStr = "unknown";
                if (bm.TargetType == BookmarkTarget.title)
                {
                   typeStr = "movie";
                   var title = await unitOfWork.TitleRepository.GetByIdAsync(bm.TargetId, cancellationToken);
                   if (title != null) legacyId = title.LegacyId ?? legacyId;
                }
                else if (bm.TargetType == BookmarkTarget.person)
                {
                   typeStr = "person";
                   var person = await unitOfWork.PersonRepository.GetByIdAsync(bm.TargetId, cancellationToken);
                   if (person != null) legacyId = person.LegacyId; // nconst
                }

                dtos.Add(new BookmarkDto(bm.Id, legacyId, typeStr, bm.Note, bm.CreatedAt));
            }
    
            return Result<IEnumerable<BookmarkDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
             Console.WriteLine($"[GetUserBookmarksAsync Error] {ex}");
             return Result<IEnumerable<BookmarkDto>>.Failure(new Error("Bookmark.GetException", ex.InnerException?.Message ?? ex.Message));
        }
    }
}
