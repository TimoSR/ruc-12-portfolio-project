using domain.movie.titleRatings;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.movie;

public class TitleRatingRepository : ITitleRatingRepository
{
    private readonly MovieDbContext _context;

    public TitleRatingRepository(MovieDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(TitleRating accountRating, CancellationToken token)
    {
        await _context.TitleRatings.AddAsync(accountRating, token);
    }

    public Task UpdateAsync(TitleRating accountRating, CancellationToken token)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token)
    {
        throw new NotImplementedException();
    }
}
