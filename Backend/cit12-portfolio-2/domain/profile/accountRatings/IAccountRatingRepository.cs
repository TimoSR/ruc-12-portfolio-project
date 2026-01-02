using service_patterns;

namespace domain.profile.accountRatings;

public interface IAccountRatingRepository : IRepository<AccountRating>
{
    IAsyncEnumerable<AccountRating> GetByAccountIdAsync(Guid accountId);
    Task<AccountRating?> GetByRatingIdAsync(Guid ratingId, CancellationToken token);
    Task AddAsync(AccountRating accountRating, CancellationToken token);
    Task UpdateAsync(AccountRating accountRating, CancellationToken token);
    Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token);
    Task<AccountRating?> GetByAccountAndTitleAsync(Guid accountId, string titleId, CancellationToken token);
}