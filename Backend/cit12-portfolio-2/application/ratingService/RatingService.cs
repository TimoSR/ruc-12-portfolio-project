using domain.profile.account;
using domain.ratings;
using infrastructure;
using service_patterns;

namespace application.ratingService;

public class RatingService(IUnitOfWork unitOfWork) : IRatingService
{
    public async Task<Result<RatingDto>> AddRatingAsync(Guid accountId, RatingCommandDto commandDto, CancellationToken cancellationToken)
    {
        // 1. You might not even need the account object itself!
        // You could just check if it exists.
        var accountExists = await unitOfWork.AccountRepository.ExistsAsync(accountId, cancellationToken);
        //var titleExists = await _unitOfWork.TitleRepository.ExistsAsync(commandDto.TitleId, cancellationToken);
        
        if (!accountExists)
            throw new AccountNotFoundException(accountId); // Use a domain-specific exception
        
        // if (!titleExists)
        //     throw new TitleNotFoundException(commandDto.TitleId);

        await unitOfWork.BeginTransactionAsync(cancellationToken);
            
        // 2. Create the new, separate aggregate
        var rating = Rating.Create(
            accountId: accountId, 
            titleId: commandDto.TitleId, 
            score: commandDto.Score, 
            comment: commandDto.Comment);
        
        // 3. Add it to its own repository
        await unitOfWork.RatingRepository.AddAsync(rating, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        
        // 4. Save changes for the rating
        await unitOfWork.CommitTransactionAsync(cancellationToken);

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
        var rating = await unitOfWork.RatingRepository.GetByIdAsync(id, cancellationToken);

        if (rating is null)
            return Result<RatingDto>.Failure(RatingErrors.NotFound);

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

        await foreach (var rating in unitOfWork.RatingRepository.GetByAccountIdAsync(accountId).WithCancellation(token))
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