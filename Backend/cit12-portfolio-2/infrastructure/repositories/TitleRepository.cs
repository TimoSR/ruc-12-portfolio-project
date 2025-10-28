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
        return await _dbContext.Movies
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Title?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Movies
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.LegacyId == legacyId, cancellationToken);
    }

    public async Task<IEnumerable<Title>> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var skip = (page - 1) * pageSize;
        
        // If query is empty, return all titles (for debugging)
        if (string.IsNullOrWhiteSpace(query))
        {
            return await _dbContext.Movies
                .AsNoTracking()
                .OrderBy(m => m.PrimaryTitle)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }
        
        return await _dbContext.Movies
            .AsNoTracking()
            .Where(m => EF.Functions.ILike(m.PrimaryTitle, $"%{query}%") ||
                       EF.Functions.ILike(m.OriginalTitle, $"%{query}%") ||
                       (m.Plot != null && EF.Functions.ILike(m.Plot, $"%{query}%")))
            .OrderBy(m => m.PrimaryTitle)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Title title, CancellationToken cancellationToken = default)
    {
        await _dbContext.Movies.AddAsync(title, cancellationToken);
    }

    public Task UpdateAsync(Title title, CancellationToken cancellationToken = default)
    {
        _dbContext.Movies.Update(title);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var title = await _dbContext.Movies.FindAsync(new object[] { id }, cancellationToken);
        if (title != null)
        {
            _dbContext.Movies.Remove(title);
        }
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Movies.AnyAsync(m => m.Id == id, cancellationToken);
    }
}
