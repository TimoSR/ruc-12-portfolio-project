using service_patterns;

namespace application.ratingService;

public record RatingDto(Guid Id, Guid AccountId, Guid TitleId, int Score, string? Comment): IDTO;
public record RatingCommandDto(Guid TitleId, int Score, string? Comment): IDTO;