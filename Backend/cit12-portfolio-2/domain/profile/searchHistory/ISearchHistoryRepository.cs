namespace domain.profile.searchHistory;

public interface ISearchHistoryRepository
{
    Task<IEnumerable<SearchHistory>> GetByAccountIdAsync(Guid accountId, int limit, CancellationToken cancellationToken);
    Task AddAsync(SearchHistory searchHistory, CancellationToken cancellationToken);
}
