using domain.movie;
using domain.movie.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public sealed class MovieRepository : IMovieRepository
{
    private readonly MovieDbContext _dbContext;

    public MovieRepository(MovieDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<Movie?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Movies
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Movie?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Movies
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.LegacyId == legacyId, cancellationToken);
    }

    public async Task<IEnumerable<Movie>> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var skip = (page - 1) * pageSize;
        
        return await _dbContext.Movies
            .AsNoTracking()
            .Where(m => m.PrimaryTitle.Contains(query))
            .OrderBy(m => m.PrimaryTitle)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }
}
