using domain.movie.title;
using domain.movie.title.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.movie;

public class TitleStatisticsRepository(MovieDbContext dbContext) : ITitleStatisticsRepository
{
    public async Task<TitleStatistics?> GetByTitleIdAsync(Guid titleId, CancellationToken cancellationToken = default)
    {
        return await dbContext.TitleStatistics
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TitleId == titleId, cancellationToken);
    }
}
