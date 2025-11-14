using service_patterns;

namespace domain.movie.titleRatings;

public record RatingCreatedEvent(
    Guid AccountId,
    Guid TitleId,
    int Score,
    DateTime RatedAt
) : DomainEvent;

/// <summary>
/// Fired when an existing rating's score is updated.
/// </summary>
public record RatingScoreUpdatedEvent(
    Guid AccountId,
    Guid TitleId,
    int NewScore,
    DateTime UpdatedAt
) : DomainEvent;