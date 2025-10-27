using application.ratingService;
using domain.account;
using domain.ratings;
using infrastructure;

public class RatingService : IRatingService
{
    private readonly IUnitOfWork _unitOfWork;

    public RatingService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task AddRatingAsync(RatingCommandDto commandDto, CancellationToken cancellationToken)
    {
        
        // 1. You might not even need the account object itself!
        // You could just check if it exists.
        var accountExists = await _unitOfWork.AccountRepository.ExistsAsync(commandDto.AccountId, cancellationToken);
        //var titleExists = await _unitOfWork.TitleRepository.ExistsAsync(commandDto.TitleId, cancellationToken);
        
        if (!accountExists)
            throw new AccountNotFoundException(commandDto.AccountId); // Use a domain-specific exception
        
        // if (!titleExists)
        //     throw new TitleNotFoundException(commandDto.TitleId);

        await _unitOfWork.BeginTransactionAsync(cancellationToken);
            
        // 2. Create the new, separate aggregate
        var rating = Rating.Create(commandDto.AccountId, commandDto.TitleId, commandDto.Score, commandDto.Comment);
        
        // 3. Add it to its own repository
        await _unitOfWork.RatingRepository.AddAsync(rating, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        // 4. Save changes for the rating
        await _unitOfWork.CommitTransactionAsync(cancellationToken);
    }
    
    public async Task<List<Rating>> GetRatingsAsync(Guid accountId, CancellationToken token)
    {
        var ratings = new List<Rating>();

        await foreach (var rating in _unitOfWork.RatingRepository.GetByAccountIdAsync(accountId).WithCancellation(token))
        {
            ratings.Add(rating);
        }

        return ratings;
    }

}