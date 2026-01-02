using service_patterns;

namespace domain.movie.titleRatings;

public class TitleRating : AggregateRoot
{
    public Guid AccountId { get; private set; } // The "foreign key"
    public string TitleId { get; private set; } // e.g., "tt0111161"
    public int Score { get; private set; } // e.g., 1-10

    internal TitleRating() {}
    
    private TitleRating(Guid accountId, string titleId, int score)
    {
        AccountId = accountId;
        TitleId = titleId;
        Score = score;

        var createdAt = DateTime.UtcNow;

        AddDomainEvent(new RatingCreatedEvent(
            AccountId,
            TitleId,
            Score,
            createdAt
        ));
    }

    // Factory method for validation and controlled instantiation
    public static TitleRating Create(Guid accountId, string titleId, int score)
    {
        if (accountId == Guid.Empty)
            throw new ArgumentException("Account ID cannot be empty.", nameof(accountId));

        if (string.IsNullOrWhiteSpace(titleId))
            throw new ArgumentException("Title ID cannot be empty.", nameof(titleId));

        if (score is < 1 or > 10)
            throw new ArgumentOutOfRangeException(nameof(score), "Score must be between 1 and 10.");

        return new TitleRating(accountId, titleId, score);
    }
    
    public void UpdateScore(int newScore)
    {
        if (newScore < 1 || newScore > 10)
            throw new ArgumentException("Score must be between 1 and 10");

        if (newScore == Score) return;
        
        Score = newScore;
        var createdAt = DateTime.UtcNow;
        AddDomainEvent(new RatingScoreUpdatedEvent(AccountId, TitleId, newScore, createdAt));
    }
}