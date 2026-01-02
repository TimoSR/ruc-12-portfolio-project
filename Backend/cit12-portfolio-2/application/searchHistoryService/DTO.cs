namespace application.searchHistoryService;

public record SearchHistoryDto(Guid Id, string Query, DateTime Timestamp);
public record CreateSearchHistoryDto(string Query);
