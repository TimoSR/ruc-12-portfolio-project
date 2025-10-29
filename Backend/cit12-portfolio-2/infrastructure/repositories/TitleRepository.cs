using domain.title;
using domain.title.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public sealed class TitleRepository : ITitleRepository
{
    private readonly MovieDbContext _dbContext;

    public TitleRepository(MovieDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<Title?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Titles
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Title?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Titles
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.LegacyId == legacyId, cancellationToken);
    }

    public async Task<IEnumerable<Title>> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var skip = (page - 1) * pageSize;
        
        // If query is empty, return all titles (for debugging)
        if (string.IsNullOrWhiteSpace(query))
        {
            return await _dbContext.Titles
                .AsNoTracking()
                .OrderBy(m => m.PrimaryTitle)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }
        
        var lowerQuery = query.ToLower();

        var queryable = _dbContext.Titles
            .AsNoTracking()
            .Where(t =>
                EF.Functions.ILike(t.PrimaryTitle, $"%{query}%") ||
                (t.OriginalTitle != null && EF.Functions.ILike(t.OriginalTitle, $"%{query}%")) ||
                (t.Plot != null && EF.Functions.ILike(t.Plot, $"%{query}%"))
            )
            .Select(t => new
            {
                Title = t,
                Rank =
                    (t.PrimaryTitle.ToLower() == lowerQuery ? 4.0 : 0.0) +                   // exact title match
                    (t.PrimaryTitle.ToLower().StartsWith(lowerQuery) ? 2.0 : 0.0) +          // prefix match
                    (t.PrimaryTitle.ToLower().Contains(lowerQuery) ? 1.0 : 0.0) +            // substring match
                    (t.OriginalTitle != null && t.OriginalTitle.ToLower() == lowerQuery ? 1.5 : 0.0) + // exact original match
                    (t.OriginalTitle != null && t.OriginalTitle.ToLower().Contains(lowerQuery) ? 0.5 : 0.0) +
                    (t.Plot != null && t.Plot.ToLower().Contains(lowerQuery) ? 0.2 : 0.0)    // weak plot influence
            })
            .OrderByDescending(x => x.Rank)
            .ThenBy(x => x.Title.PrimaryTitle)  // tie-break by title
            .Skip(skip)
            .Take(pageSize);

        var results = await queryable
            .Select(x => x.Title)
            .ToListAsync(cancellationToken);

        return results;
    }

    public async Task AddAsync(Title title, CancellationToken cancellationToken = default)
    {
        await _dbContext.Titles.AddAsync(title, cancellationToken);
    }

    public Task UpdateAsync(Title title, CancellationToken cancellationToken = default)
    {
        _dbContext.Titles.Update(title);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var title = await _dbContext.Titles.FindAsync(new object[] { id }, cancellationToken);
        if (title != null)
        {
            _dbContext.Titles.Remove(title);
        }
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Titles.AnyAsync(m => m.Id == id, cancellationToken);
    }
}
