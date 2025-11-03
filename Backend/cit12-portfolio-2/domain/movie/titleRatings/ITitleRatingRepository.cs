using service_patterns;

namespace domain.movie.titleRatings;

public interface ITitleRatingRepository : IRepository<TitleRating>
{

    Task AddAsync(TitleRating accountRating, CancellationToken token);
    Task UpdateAsync(TitleRating accountRating, CancellationToken token);
    Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token);
}