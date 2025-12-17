using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using application.services;
using service_patterns;

namespace application.bookmarkService;

public interface IBookmarkService
{
    Task<Result<BookmarkDto>> ToggleBookmarkAsync(Guid accountId, CreateBookmarkDto dto, CancellationToken cancellationToken = default);
    Task<Result<IEnumerable<BookmarkDto>>> GetBookmarksAsync(Guid accountId, CancellationToken cancellationToken = default);
    Task<Result<bool>> IsBookmarkedAsync(Guid accountId, Guid? titleId, Guid? personId, CancellationToken cancellationToken = default);
}
