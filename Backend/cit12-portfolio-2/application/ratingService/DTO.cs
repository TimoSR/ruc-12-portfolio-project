using service_patterns;

namespace application.ratingService;

public record RatingCommandDto(Guid AccountId, Guid TitleId, int Score, string? Comment) : IDTO;