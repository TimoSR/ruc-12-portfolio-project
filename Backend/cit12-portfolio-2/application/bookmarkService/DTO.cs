namespace application.bookmarkService;

public record BookmarkDto(Guid Id, string TargetId, string TargetType, string? Note, DateTime CreatedAt);
public record CreateBookmarkDto(string TargetId, string TargetType, string? Note);
