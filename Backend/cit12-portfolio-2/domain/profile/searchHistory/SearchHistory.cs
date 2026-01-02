using service_patterns;

namespace domain.profile.searchHistory;

public class SearchHistory : AggregateRoot
{
    public Guid Id { get; private set; }
    public Guid AccountId { get; private set; }
    public string Query { get; private set; }
    public DateTime Timestamp { get; private set; }

    internal SearchHistory(Guid id, Guid accountId, string query, DateTime timestamp)
    {
        Id = id;
        AccountId = accountId;
        Query = query;
        Timestamp = timestamp;
    }

    private SearchHistory(Guid accountId, string query)
    {
        Id = Guid.NewGuid();
        AccountId = accountId;
        Query = query;
        Timestamp = DateTime.UtcNow;
    }

    public static SearchHistory Create(Guid accountId, string query)
    {
        if (accountId == Guid.Empty)
            throw new ArgumentException("Account ID cannot be empty.", nameof(accountId));

        if (string.IsNullOrWhiteSpace(query))
            throw new ArgumentException("Search query cannot be empty.", nameof(query));

        return new SearchHistory(accountId, query);
    }
}
