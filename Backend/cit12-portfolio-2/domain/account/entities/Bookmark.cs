namespace domain.account.entities;

public class Bookmark
{
    public Guid Id { get; private set; }
    public Guid AccountId { get; private set; }
    public Guid TargetId { get; private set; }
    public BookmarkTarget TargetType { get; private set; }
    public string? Note { get; private set; }
    public DateTime AddedAt { get; private set; }

    // Navigation
    public Account Account { get; private set; } = default!;

    private Bookmark() { }

    public Bookmark(Guid accountId, Guid targetId, BookmarkTarget targetType, string? note = null)
    {
        Id = Guid.NewGuid();
        AccountId = accountId;
        TargetId = targetId;
        TargetType = targetType;
        Note = note;
        AddedAt = DateTime.UtcNow;
    }
}

public enum BookmarkTarget
{
    Movie = 1,
    Series = 2,
    Actor = 3,
    Other = 99
}