using domain.ratings;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public class RatingRepository : IRatingRepository
{
    private readonly MovieDbContext _context;

    public RatingRepository(MovieDbContext context)
    {
        _context = context;
    }
    
    public IAsyncEnumerable<Rating> GetByAccountIdAsync(Guid accountId)
    {
        return _context.Ratings
            .Where(r => r.AccountId == accountId)
            .AsAsyncEnumerable(); 
    }

    public async Task<Rating?> GetByIdAsync(Guid ratingId, CancellationToken token)
    {
        return await _context.Ratings
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == ratingId, token);
    }

    public Task AddAsync(Rating rating, CancellationToken token)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(Rating rating, CancellationToken token)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token)
    {
        throw new NotImplementedException();
    }

    public Task<Rating?> GetByAccountAndTitleAsync(Guid accountId, Guid titleId, CancellationToken token)
    {
        throw new NotImplementedException();
    }
}
