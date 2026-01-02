using service_patterns;

namespace domain.profile.bookmarks;

public class Bookmark : AggregateRoot
{
    public Guid Id { get; private set; }
    public Guid AccountId { get; private set; }
    public Guid TargetId { get; private set; }
    public BookmarkTarget TargetType { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string? Note { get; private set; }

    // Constructor for EF Core / Data mapping
    internal Bookmark(Guid id, Guid accountId, Guid targetId, BookmarkTarget targetType, DateTime createdAt, string? note)
    {
        Id = id;
        AccountId = accountId;
        TargetId = targetId;
        TargetType = targetType;
        CreatedAt = createdAt;
        Note = note;
    }

    private Bookmark(Guid accountId, Guid targetId, BookmarkTarget targetType, string? note)
    {
        Id = Guid.NewGuid();
        AccountId = accountId;
        TargetId = targetId;
        TargetType = targetType;
        CreatedAt = DateTime.UtcNow;
        Note = note;
    }

    public static Bookmark Create(Guid accountId, Guid targetId, BookmarkTarget targetType, string? note = null)
    {
        if (accountId == Guid.Empty)
            throw new ArgumentException("Account ID cannot be empty.", nameof(accountId));

        if (targetId == Guid.Empty)
            throw new ArgumentException("Target ID cannot be empty.", nameof(targetId));

        return new Bookmark(accountId, targetId, targetType, note);
    }
}
