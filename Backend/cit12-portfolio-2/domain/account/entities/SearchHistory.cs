namespace domain.account.entities;

public class SearchHistory
{
    public Guid Id { get; private set; }
    public Guid AccountId { get; private set; }
    public string SearchQuery { get; private set; } = default!;
    public DateTime SearchedAt { get; private set; }

    // Navigation
    public Account Account { get; private set; } = default!;

    private SearchHistory() { }

    public SearchHistory(Guid accountId, string searchQuery)
    {
        Id = Guid.NewGuid();
        AccountId = accountId;
        SearchQuery = searchQuery;
        SearchedAt = DateTime.UtcNow;
    }
}