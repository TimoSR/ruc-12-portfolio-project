using domain.profile.accountRatings;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.profile;

public class AccountRatingRepository(MovieDbContext context) : IAccountRatingRepository
{
    public IAsyncEnumerable<AccountRating> Ratings(string titleId) => context.AccountRatings.Where(r => r.TitleId == titleId).AsAsyncEnumerable();
    
    public IAsyncEnumerable<AccountRating> GetByAccountIdAsync(Guid accountId)
    {
        return context.AccountRatings
            .Where(r => r.AccountId == accountId)
            .AsAsyncEnumerable(); 
    }

    public async Task<AccountRating?> GetByRatingIdAsync(Guid ratingId, CancellationToken token)
    {
        return await context.AccountRatings
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == ratingId, token);
    }

    public async Task AddAsync(AccountRating accountRating, CancellationToken token)
    {
        await context.AccountRatings.AddAsync(accountRating, token);
    }

    public Task UpdateAsync(AccountRating accountRating, CancellationToken token)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token)
    {
        throw new NotImplementedException();
    }

    public async Task<AccountRating?> GetByAccountAndTitleAsync(Guid accountId, string titleId, CancellationToken token)
    {
        return await context.AccountRatings
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.AccountId == accountId && r.TitleId == titleId, token);
    }
}
