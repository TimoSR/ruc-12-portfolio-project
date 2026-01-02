using domain.profile.searchHistory;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.profile;

public class SearchHistoryRepository(MovieDbContext context) : ISearchHistoryRepository
{
    public async Task<IEnumerable<SearchHistory>> GetByAccountIdAsync(Guid accountId, int limit, CancellationToken cancellationToken)
    {
        return await context.SearchHistory
            .Where(sh => sh.AccountId == accountId)
            .OrderByDescending(sh => sh.Timestamp)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(SearchHistory searchHistory, CancellationToken cancellationToken)
    {
        await context.SearchHistory.AddAsync(searchHistory, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
}
