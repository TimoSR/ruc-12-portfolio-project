using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using domain.profile.bookmark;

namespace domain.profile.bookmark.interfaces;

public interface IBookmarkRepository
{
    Task<Bookmark?> GetAsync(Guid accountId, Guid? titleId, Guid? personId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Bookmark>> GetAllForAccountAsync(Guid accountId, CancellationToken cancellationToken = default);
    Task AddAsync(Bookmark bookmark, CancellationToken cancellationToken = default);
    void Remove(Bookmark bookmark);
}
