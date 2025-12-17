using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using application.services;
using domain.profile.bookmark;
using infrastructure;
using service_patterns;

namespace application.bookmarkService;

public class BookmarkService : IBookmarkService
{
    private readonly IUnitOfWork _unitOfWork;

    public BookmarkService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<BookmarkDto>> ToggleBookmarkAsync(Guid accountId, CreateBookmarkDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.TitleId == null && dto.PersonId == null)
        {
            return Result<BookmarkDto>.Failure(new Error("Bookmark.Invalid", "Must provide either TitleId or PersonId."));
        }

        var existingBookmark = await _unitOfWork.BookmarkRepository.GetAsync(accountId, dto.TitleId, dto.PersonId, cancellationToken);

        if (existingBookmark != null)
        {
            // Remove bookmark
            _unitOfWork.BookmarkRepository.Remove(existingBookmark);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            // Return the deleted bookmark DTO with IsDeleted = true (we need to update DTO first)
            // For now, let's assume we update DTO. 
            // Or we can just return the DTO and let the controller handle it? 
            // But the controller needs to know.
            // Let's update the DTO construction below.
            return Result<BookmarkDto>.Success(new BookmarkDto(
                existingBookmark.AccountId,
                existingBookmark.TitleId,
                existingBookmark.PersonId,
                existingBookmark.Notes,
                existingBookmark.CreatedAt,
                true // IsDeleted
            )); 
        }

        // Create new bookmark
        var newBookmark = new Bookmark
        {
            Id = Guid.NewGuid(),
            AccountId = accountId,
            TitleId = dto.TitleId,
            PersonId = dto.PersonId,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.BookmarkRepository.AddAsync(newBookmark, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<BookmarkDto>.Success(new BookmarkDto(
            newBookmark.AccountId,
            newBookmark.TitleId,
            newBookmark.PersonId,
            newBookmark.Notes,
            newBookmark.CreatedAt,
            false // IsDeleted
        ));
    }

    public async Task<Result<IEnumerable<BookmarkDto>>> GetBookmarksAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        var bookmarks = await _unitOfWork.BookmarkRepository.GetAllForAccountAsync(accountId, cancellationToken);

        var dtos = bookmarks.Select(b => new BookmarkDto(
            b.AccountId,
            b.TitleId,
            b.PersonId,
            b.Notes,
            b.CreatedAt,
            false
        ));

        return Result<IEnumerable<BookmarkDto>>.Success(dtos);
    }

    public async Task<Result<bool>> IsBookmarkedAsync(Guid accountId, Guid? titleId, Guid? personId, CancellationToken cancellationToken = default)
    {
        var bookmark = await _unitOfWork.BookmarkRepository.GetAsync(accountId, titleId, personId, cancellationToken);
        return Result<bool>.Success(bookmark != null);
    }
}
