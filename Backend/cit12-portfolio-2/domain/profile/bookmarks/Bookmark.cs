using service_patterns;

namespace domain.profile.bookmarks;

public class Bookmark : AggregateRoot
{
    public Guid Id { get; private set; }
    public Guid AccountId { get; private set; }
    public Guid TargetId { get; private set; } // EPC: Reverted to Guid for Locked DB
    // EPC: Reverted to Guid for Locked DB
    public string TargetType { get; private set; } // "movie" or "person"
    public DateTime CreatedAt { get; private set; }
    public string? Note { get; private set; }

    internal Bookmark(Guid id, Guid accountId, Guid targetId, string targetType, DateTime createdAt, string? note)
    {
        Id = id;
        AccountId = accountId;
        TargetId = targetId;
        TargetType = targetType;
        CreatedAt = createdAt;
        Note = note;
    }

    private Bookmark(Guid accountId, Guid targetId, string targetType, string? note)
    {
        Id = Guid.NewGuid();
        AccountId = accountId;
        TargetId = targetId;
        TargetType = targetType;
        CreatedAt = DateTime.UtcNow;
        Note = note;
    }

    public static Bookmark Create(Guid accountId, Guid targetId, string targetType, string? note = null)
    {
        if (accountId == Guid.Empty)
            throw new ArgumentException("Account ID cannot be empty.", nameof(accountId));

        if (targetId == Guid.Empty)
            throw new ArgumentException("Target ID cannot be empty.", nameof(targetId));
            
        if (string.IsNullOrWhiteSpace(targetType) || (targetType != "movie" && targetType != "person"))
             throw new ArgumentException("Target type must be 'movie' or 'person'.", nameof(targetType));

        return new Bookmark(accountId, targetId, targetType, note);
    }
}
