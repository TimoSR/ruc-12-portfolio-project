namespace application.ratingService;

public record RatingDto(
    Guid Id,
    Guid AccountId,
    Guid TitleId,
    int Value,
    string? Comment,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public record CreateRatingDto(Guid TitleId, int Value, string? Comment);
public record UpdateRatingDto(int Value, string? Comment);