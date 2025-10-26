using domain.account.interfaces;
using domain.account.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public class RatingRepository : IRatingRepository
{
    private readonly MovieDbContext _context;

    public RatingRepository(MovieDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Rating>> GetByAccountIdAsync(Guid accountId, CancellationToken token)
    {
        return await _context.Ratings
            .AsNoTracking()
            .Where(r => r.AccountId == accountId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(token);
    }

    public async Task<Rating?> GetByIdAsync(Guid accountId, Guid ratingId, CancellationToken token)
    {
        return await _context.Ratings
            .FirstOrDefaultAsync(r => r.AccountId == accountId && r.Id == ratingId, token);
    }

    public async Task<Rating?> GetByAccountAndTitleAsync(Guid accountId, Guid titleId, CancellationToken token)
    {
        return await _context.Ratings
            .FirstOrDefaultAsync(r => r.AccountId == accountId && r.TitleId == titleId, token);
    }

    public async Task AddAsync(Rating rating, CancellationToken token)
    {
        await _context.Ratings.AddAsync(rating, token);
    }

    public async Task UpdateAsync(Rating rating, CancellationToken token)
    {
        _context.Ratings.Update(rating);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token)
    {
        var existing = await _context.Ratings
            .FirstOrDefaultAsync(r => r.AccountId == accountId && r.Id == ratingId, token);

        if (existing != null)
            _context.Ratings.Remove(existing);
    }
}
