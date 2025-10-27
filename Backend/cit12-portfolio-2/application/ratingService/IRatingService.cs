using domain.ratings;
using service_patterns;

namespace application.ratingService;

public interface IRatingService
{
    public Task<Result<Rating>> AddRatingAsync(RatingCommandDto commandDto, CancellationToken cancellationToken);
    public Task<Result<Rating>> GetRatingByIdAsync(Guid id, CancellationToken cancellationToken);
    public Task<Result<List<Rating>>> GetRatingsAsync(Guid accountId, CancellationToken token);
}