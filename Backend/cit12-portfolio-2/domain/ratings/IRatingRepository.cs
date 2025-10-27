using service_patterns;

namespace domain.ratings;

public interface IRatingRepository : IRepository<Rating>
{
    IAsyncEnumerable<Rating> GetByAccountIdAsync(Guid accountId);
    Task<Rating?> GetByIdAsync(Guid accountId, Guid ratingId, CancellationToken token);
    Task AddAsync(Rating rating, CancellationToken token);
    Task UpdateAsync(Rating rating, CancellationToken token);
    Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token);
    
    // Optional helpers if you need them later:
    Task<Rating?> GetByAccountAndTitleAsync(Guid accountId, Guid titleId, CancellationToken token);
}