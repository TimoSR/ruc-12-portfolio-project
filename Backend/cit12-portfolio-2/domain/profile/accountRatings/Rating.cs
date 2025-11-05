using service_patterns;

// This might be in a different domain context, like 'domain.ratings'
namespace domain.ratings;

public class Rating : AggregateRoot
{
    public Guid Id { get; private set; }
    public Guid AccountId { get; private set; } // The "foreign key"
    public Guid TitleId { get; private set; } // e.g., "tt0111161"
    public int Score { get; private set; } // e.g., 1-10
    public string? Comment { get; private set; }
    public DateTime CreatedAt { get; private set; }

    internal Rating(Guid id, Guid accountId, Guid titleId, int score, string? comment, DateTime createdAt)
    {
        Id = id;
        AccountId = accountId;
        TitleId = titleId;
        Score = score;
        CreatedAt = createdAt;
        Comment = comment;
    }
    
    private Rating(Guid accountId, Guid titleId, int score, string? comment = null)
    {
        AccountId = accountId;
        TitleId = titleId;
        Score = score;
        Comment = comment; // Nullable, no need for explicit null check

        CreatedAt = DateTime.UtcNow;

        AddDomainEvent(new RatingCreatedEvent(
            Id,
            AccountId,
            TitleId,
            Score,
            CreatedAt // Use UtcNow consistently
        ));
    }

    // Factory method for validation and controlled instantiation
    public static Rating Create(Guid accountId, Guid titleId, int score, string? comment = null)
    {
        if (accountId == Guid.Empty)
            throw new ArgumentException("Account ID cannot be empty.", nameof(accountId));

        if (titleId == Guid.Empty)
            throw new ArgumentException("Title ID cannot be empty.", nameof(titleId));

        if (score is < 1 or > 10)
            throw new ArgumentOutOfRangeException(nameof(score), "Score must be between 1 and 10.");

        if (comment is not null && comment.Length > 500)
            throw new ArgumentException("Comment cannot exceed 500 characters.", nameof(comment));

        return new Rating(accountId, titleId, score, comment);
    }
    
    public void UpdateScore(int newScore)
    {
        if (newScore < 1 || newScore > 10)
            throw new ArgumentException("Score must be between 1 and 10");

        if (newScore != Score)
        {
            Score = newScore;
            CreatedAt = DateTime.UtcNow;
            AddDomainEvent(new RatingScoreUpdatedEvent(Id, newScore, CreatedAt));
        }
    }
}