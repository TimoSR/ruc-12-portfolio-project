namespace domain.profile.bookmark;

public class Bookmark
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public required string TargetId { get; set; } // tconst (movie) or nconst (person)
    public required string TargetType { get; set; } // "title" or "person"
    public string? Note { get; set; } // JSON or simple string, using string for simplicity now
    public DateTime AddedAt { get; set; }
}
