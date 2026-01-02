using domain.profile.searchHistory;
using service_patterns;

namespace application.searchHistoryService;

public class SearchHistoryService(ISearchHistoryRepository historyRepository) : ISearchHistoryService
{
    public async Task<Result<SearchHistory>> AddSearchAsync(Guid accountId, string query, CancellationToken cancellationToken)
    {
        try
        {
            var entry = SearchHistory.Create(accountId, query);
            await historyRepository.AddAsync(entry, cancellationToken);
            return Result<SearchHistory>.Success(entry);
        }
        catch (ArgumentException ex)
        {
            return Result<SearchHistory>.Failure(new Error("SearchHistory.Invalid", ex.Message));
        }
    }

    public async Task<Result<IEnumerable<SearchHistory>>> GetUserHistoryAsync(Guid accountId, int limit, CancellationToken cancellationToken)
    {
        var history = await historyRepository.GetByAccountIdAsync(accountId, limit, cancellationToken);
        return Result<IEnumerable<SearchHistory>>.Success(history);
    }
}
