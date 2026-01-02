using service_patterns;

namespace application.ratingService;

public record RatingDto(Guid Id, Guid AccountId, string TitleId, int Score, string? Comment): IDTO;
public record RatingCommandDto(string TitleId, int Score, string? Comment): IDTO;