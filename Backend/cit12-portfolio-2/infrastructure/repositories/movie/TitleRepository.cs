using domain.movie.title.interfaces;
using domain.title;
using domain.title.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.movie;

public sealed class TitleRepository(MovieDbContext dbContext) : ITitleRepository
{
    public async Task<Title?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Titles
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Title?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Titles
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.LegacyId == legacyId, cancellationToken);
    }

    public async Task<(IEnumerable<Title> items, int totalCount)> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var skip = (page - 1) * pageSize;
        
        IQueryable<Title> baseQuery;
        
        // If query is empty, return all titles (for debugging)
        if (string.IsNullOrWhiteSpace(query))
        {
            baseQuery = dbContext.Titles.AsNoTracking();
            
            var count = await baseQuery.CountAsync(cancellationToken);
            
            var items = await baseQuery
                .OrderBy(m => m.PrimaryTitle)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
            
            return (items, count);
        }
        
        var lowerQuery = query.ToLower();

        var rankedQuery = dbContext.Titles
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
            });

        // Count total before applying Skip/Take
        var totalCount = await rankedQuery.CountAsync(cancellationToken);
        
        var results = await rankedQuery
            .OrderByDescending(x => x.Rank)
            .ThenBy(x => x.Title.PrimaryTitle)  // tie-break by title
            .Skip(skip)
            .Take(pageSize)
            .Select(x => x.Title)
            .ToListAsync(cancellationToken);

        return (results, totalCount);
    }

    public async Task AddAsync(Title title, CancellationToken cancellationToken = default)
    {
        await dbContext.Titles.AddAsync(title, cancellationToken);
    }

    public Task UpdateAsync(Title title, CancellationToken cancellationToken = default)
    {
        dbContext.Titles.Update(title);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var title = await dbContext.Titles.FindAsync(new object[] { id }, cancellationToken);
        if (title != null)
        {
            dbContext.Titles.Remove(title);
        }
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Titles.AnyAsync(m => m.Id == id, cancellationToken);
    }
}
