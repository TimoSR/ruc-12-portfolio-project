using service_patterns;

namespace application.ratingService;

public interface IRatingService
{
    Task<IEnumerable<RatingDto>> GetByAccountIdAsync(Guid accountId, CancellationToken token);
    Task<RatingDto?> GetByIdAsync(Guid accountId, Guid ratingId, CancellationToken token);
    Task<RatingDto> CreateAsync(Guid accountId, CreateRatingDto dto, CancellationToken token);
    Task<RatingDto> ReplaceAsync(Guid accountId, Guid ratingId, UpdateRatingDto dto, CancellationToken token);
    Task<RatingDto> UpdatePartialAsync(Guid accountId, Guid ratingId, JsonPatchDocument<UpdateRatingDto> patch, CancellationToken token);
    Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token);
}