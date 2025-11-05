using service_patterns;

namespace domain.ratings;

public record RatingCreatedEvent(
    Guid RatingId,
    Guid AccountId,
    Guid TitleId,
    int Score,
    DateTime RatedAt
) : DomainEvent;

/// <summary>
/// Fired when an existing rating's score is updated.
/// </summary>
public record RatingScoreUpdatedEvent(
    Guid RatingId,
    int NewScore,
    DateTime UpdatedAt
) : DomainEvent;