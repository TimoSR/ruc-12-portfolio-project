using domain.ratings;
using service_patterns;

namespace application.ratingService;

public interface IRatingService
{
    public Task AddRatingAsync(RatingCommandDto commandDto, CancellationToken cancellationToken);
    public Task<List<Rating>> GetRatingsAsync(Guid accountId, CancellationToken token);
}