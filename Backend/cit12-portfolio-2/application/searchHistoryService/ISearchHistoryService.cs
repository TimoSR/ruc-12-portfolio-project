using domain.profile.searchHistory;
using service_patterns;

namespace application.searchHistoryService;

public interface ISearchHistoryService
{
    Task<Result<SearchHistory>> AddSearchAsync(Guid accountId, string query, CancellationToken cancellationToken);
    Task<Result<IEnumerable<SearchHistory>>> GetUserHistoryAsync(Guid accountId, int limit, CancellationToken cancellationToken);
}
