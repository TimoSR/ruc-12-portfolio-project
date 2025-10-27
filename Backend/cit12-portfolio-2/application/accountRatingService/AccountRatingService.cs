using application.ratingService;
using domain.account.interfaces;

namespace application.accountRatingService;

public class AccountRatingService
{
    private readonly IAccountRepository _accountRepository;
    private readonly IRatingRepository _ratingRepository;

    public AccountRatingService(
        IAccountRepository accountRepository,
        IRatingRepository ratingRepository)
    {
        _accountRepository = accountRepository;
        _ratingRepository = ratingRepository;
    }

    // -----------------------------------------
    // READ OPERATIONS (via RatingRepository)
    // -----------------------------------------
    public async Task<IEnumerable<RatingDto>> GetByAccountIdAsync(Guid accountId, CancellationToken token)
    {
        var ratings = await _ratingRepository.GetByAccountIdAsync(accountId, token);
        
        return ratings.Select(r => new RatingDto(
            r.Id!.Value,
            r.AccountId,
            r.TitleId,
            r.Score,
            r.Comment,
            r.CreatedAt,
            r.UpdatedAt));
    }

    public async Task<RatingDto?> GetByIdAsync(Guid accountId, Guid ratingId, CancellationToken token)
    {
        var rating = await _ratingRepository.GetByIdAsync(accountId, ratingId, token);
        return rating == null
            ? null
            : new RatingDto(
                rating.Id!.Value,
                rating.AccountId,
                rating.TitleId,
                rating.Score,
                rating.Comment,
                rating.CreatedAt,
                rating.UpdatedAt);
    }

    // -----------------------------------------
    // WRITE OPERATIONS (through Account Aggregate)
    // -----------------------------------------

    public async Task<RatingDto> CreateAsync(Guid accountId, CreateRatingDto dto, CancellationToken token)
    {
        var account = await _accountRepository.GetByIdAsync(accountId, token)
            ?? throw new KeyNotFoundException("Account not found.");

        var existing = await _ratingRepository.GetByAccountAndTitleAsync(accountId, dto.TitleId, token);
        
        if (existing != null)
            throw new InvalidOperationException("A rating already exists for this title.");

        account.AddOrUpdateRating(dto.TitleId, dto.Value, dto.Comment);

        var newRating = account.GetRating(dto.TitleId)!;
        return new RatingDto(
            newRating.Id!.Value,
            newRating.AccountId,
            newRating.TitleId,
            newRating.Value,
            newRating.Comment,
            newRating.CreatedAt,
            newRating.UpdatedAt);
    }

    /*public async Task<RatingDto> ReplaceAsync(Guid accountId, Guid ratingId, UpdateRatingDto dto, CancellationToken token)
    {
        var account = await _accountRepository.GetByIdAsync(accountId, token)
            ?? throw new KeyNotFoundException("Account not found.");

        var rating = account.RatingsHistory().FirstOrDefault(r => r.Id == ratingId)
            ?? throw new KeyNotFoundException("Rating not found.");

        rating.Update(dto.Value, dto.Comment);

        await _accountRepository.UpdateAsync(account, token);
        await _accountRepository.SaveChangesAsync(token);

        return new RatingDto(
            rating.Id!.Value,
            rating.AccountId,
            rating.TitleId,
            rating.Value,
            rating.Comment,
            rating.CreatedAt,
            rating.UpdatedAt);
    }

    public async Task<RatingDto> UpdatePartialAsync(Guid accountId, Guid ratingId, JsonPatchDocument<UpdateRatingDto> patch, CancellationToken token)
    {
        var account = await _accountRepository.GetByIdAsync(accountId, token)
            ?? throw new KeyNotFoundException("Account not found.");

        var rating = account.Ratings().FirstOrDefault(r => r.Id == ratingId)
            ?? throw new KeyNotFoundException("Rating not found.");

        var dto = new UpdateRatingDto(rating.Value, rating.Comment);
        patch.ApplyTo(dto);

        rating.Update(dto.Value, dto.Comment);

        await _accountRepository.UpdateAsync(account, token);
        await _accountRepository.SaveChangesAsync(token);

        return new RatingDto(
            rating.Id!.Value,
            rating.AccountId,
            rating.TitleId,
            rating.Value,
            rating.Comment,
            rating.CreatedAt,
            rating.UpdatedAt);
    }

    public async Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token)
    {
        var account = await _accountRepository.GetByIdAsync(accountId, token)
            ?? throw new KeyNotFoundException("Account not found.");

        var rating = account.Ratings().FirstOrDefault(r => r.Id == ratingId);
        if (rating == null)
            return;

        account.RemoveRating(rating.TitleId);

        await _accountRepository.UpdateAsync(account, token);
        await _accountRepository.SaveChangesAsync(token);
    }*/
}
