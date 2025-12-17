using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using domain.profile.bookmark;
using domain.profile.bookmark.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.profile;

public class BookmarkRepository : IBookmarkRepository
{
    private readonly MovieDbContext _dbContext;

    public BookmarkRepository(MovieDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Bookmark?> GetAsync(Guid accountId, Guid? titleId, Guid? personId, CancellationToken cancellationToken = default)
    {
        // Since we can't easily query by composite key with nulls in FindAsync, we use FirstOrDefault
        var query = _dbContext.Bookmarks.AsQueryable();

        query = query.Where(x => x.AccountId == accountId);

        if (titleId.HasValue)
        {
            query = query.Where(x => x.TitleId == titleId);
        }
        else
        {
            // If titleId is null, we want to ensure we are looking for a person bookmark (so TitleId IS null)
            // But wait, if we pass null for titleId, does it mean "don't care" or "must be null"?
            // In this context, a bookmark is either for a title OR a person.
            // If we ask for a title bookmark, personId should be null.
            query = query.Where(x => x.TitleId == null);
        }

        if (personId.HasValue)
        {
            query = query.Where(x => x.PersonId == personId);
        }
        else
        {
            query = query.Where(x => x.PersonId == null);
        }

        return await query.FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bookmark>> GetAllForAccountAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Bookmarks
            .Where(x => x.AccountId == accountId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Bookmark bookmark, CancellationToken cancellationToken = default)
    {
        await _dbContext.Bookmarks.AddAsync(bookmark, cancellationToken);
    }

    public void Remove(Bookmark bookmark)
    {
        _dbContext.Bookmarks.Remove(bookmark);
    }
}
