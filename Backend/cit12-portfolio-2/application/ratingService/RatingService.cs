using domain.movie.titleRatings;
using domain.profile.account;
using domain.profile.accountRatings;
using domain.title;
using infrastructure;
using service_patterns;

namespace application.ratingService;

public class RatingService(IUnitOfWork unitOfWork) : IRatingService
{
    public async Task<Result<RatingDto>> AddRatingAsync(
        Guid accountId,
        RatingCommandDto commandDto,
        CancellationToken cancellationToken)
    {
        var accountExists = await unitOfWork.AccountRepository
            .ExistsAsync(accountId, cancellationToken);

        var titleExists = await unitOfWork.TitleRepository
            .ExistsAsync(commandDto.TitleId, cancellationToken);

        if (!accountExists)
            throw new AccountNotFoundException(accountId);

        if (!titleExists)
            throw new TitleNotFoundException(commandDto.TitleId);
        
        var existingAccountRating = await unitOfWork.AccountRatingRepository
            .GetByAccountAndTitleAsync(accountId, commandDto.TitleId, cancellationToken);
        
        if (existingAccountRating is not null)
            return Result<RatingDto>.Failure(AccountRatingErrors.DuplicateRating);
        
        await unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var accountRating = AccountRating.Create(
                accountId: accountId,
                titleId: commandDto.TitleId,
                score: commandDto.Score,
                comment: commandDto.Comment);

            await unitOfWork.AccountRatingRepository.AddAsync(accountRating, cancellationToken);
            
            var titleRating = TitleRating.Create(
                accountId: accountRating.AccountId,
                titleId: accountRating.TitleId,
                score: accountRating.Score);

            await unitOfWork.TitleRatingRepository.AddAsync(titleRating, cancellationToken);

            await unitOfWork.CommitTransactionAsync(cancellationToken);
            
            var dto = new RatingDto(
                Id: accountRating.Id,
                AccountId: accountRating.AccountId,
                TitleId: accountRating.TitleId,
                Score: accountRating.Score,
                Comment: accountRating.Comment);

            return Result<RatingDto>.Success(dto);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
    
    public async Task<Result<RatingDto>> GetRatingByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var rating = await unitOfWork.AccountRatingRepository.GetByRatingIdAsync(id, cancellationToken);

        if (rating is null)
            return Result<RatingDto>.Failure(AccountRatingErrors.NotFound);

        var dto = new RatingDto(
            Id: rating.Id, 
            AccountId: rating.AccountId,
            TitleId: rating.TitleId,
            Score: rating.Score,
            Comment: rating.Comment);
        
        
        return Result<RatingDto>.Success(dto);
    }
    
    public async Task<Result<List<RatingDto>>> GetRatingsAsync(Guid accountId, CancellationToken token)
    {
        var ratings = new List<RatingDto>();

        await foreach (var rating in unitOfWork.AccountRatingRepository.GetByAccountIdAsync(accountId).WithCancellation(token))
        {
            var dto = new RatingDto(
                Id: rating.Id,
                AccountId: rating.AccountId,
                TitleId: rating.TitleId,
                Score: rating.Score,
                Comment: rating.Comment);
            
            ratings.Add(dto);
        }
        
        return Result<List<RatingDto>>.Success(ratings);
    }

}