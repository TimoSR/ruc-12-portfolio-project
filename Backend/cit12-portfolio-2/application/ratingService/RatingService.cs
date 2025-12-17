using domain.movie.titleRatings;
using domain.profile.account;
using domain.profile.accountRatings;
using domain.title;
using infrastructure;
using service_patterns;
using Microsoft.EntityFrameworkCore;

namespace application.ratingService;

public class RatingService(IUnitOfWork unitOfWork, MovieDbContext dbContext) : IRatingService
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
        
        // Use the database function to rate
        // api.rate(p_title_id UUID, p_rating INT, p_account_id UUID)
        await dbContext.Database.ExecuteSqlRawAsync(
            "SELECT api.rate({0}, {1}, {2})", 
            new object[] { commandDto.TitleId, commandDto.Score, accountId }, 
            cancellationToken);
            
        // We construct the DTO manually. The ID is not returned by the function, 
        // but we can fetch it if strictly necessary. For now, we return a placeholder or fetch it.
        // To be safe and correct, let's fetch the rating we just created/updated.
        
        var rating = await unitOfWork.AccountRatingRepository
            .GetByAccountAndTitleAsync(accountId, commandDto.TitleId, cancellationToken);
            
        if (rating is null)
             return Result<RatingDto>.Failure(new Error("Rating.Failed", "Failed to retrieve rating after creation."));

        var dto = new RatingDto(
            Id: rating.Id,
            AccountId: rating.AccountId,
            TitleId: rating.TitleId,
            Score: rating.Score,
            Comment: rating.Comment);

        return Result<RatingDto>.Success(dto);
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

    public async Task<Result<RatingDto>> GetRatingByAccountAndTitleAsync(Guid accountId, Guid titleId, CancellationToken cancellationToken)
    {
        var rating = await unitOfWork.AccountRatingRepository
            .GetByAccountAndTitleAsync(accountId, titleId, cancellationToken);
            
        if (rating is null)
             return Result<RatingDto>.Failure(new Error("Rating.NotFound", "Rating not found."));

        var dto = new RatingDto(
            Id: rating.Id,
            AccountId: rating.AccountId,
            TitleId: rating.TitleId,
            Score: rating.Score,
            Comment: rating.Comment);

        return Result<RatingDto>.Success(dto);
    }

}