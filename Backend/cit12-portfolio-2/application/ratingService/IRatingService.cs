using service_patterns;

namespace application.ratingService;

public interface IRatingService
{
    public Task<Result<RatingDto>> AddRatingAsync(Guid accountId, RatingCommandDto commandDto, CancellationToken cancellationToken);
    public Task<Result<RatingDto>> GetRatingByIdAsync(Guid id, CancellationToken cancellationToken);
    public Task<Result<List<RatingDto>>> GetRatingsAsync(Guid accountId, CancellationToken token);
}