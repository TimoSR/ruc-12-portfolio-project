using domain.movie.titleRatings;
using domain.profile.account;
using domain.profile.accountRatings;
using domain.title;
using domain.movie.title;
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

        // EPC: Validate Title - Support both Internal GUID and Legacy ID
        Title? title = null;

        if (Guid.TryParse(commandDto.TitleId, out var parsedGuid))
        {
            title = await unitOfWork.TitleRepository.GetByIdAsync(parsedGuid, cancellationToken);
        }

        if (title is null)
        { 
            // Fallback to Legacy lookup (e.g. for "tt1234567")
            title = await unitOfWork.TitleRepository.GetByLegacyIdAsync(commandDto.TitleId, cancellationToken);
        }

        if (title is null)
            throw new TitleNotFoundException(commandDto.TitleId);

        if (!accountExists)
            throw new AccountNotFoundException(accountId);
        
        // EPC: Bridge - Use the Internal Guid from the found title
        Guid internalTitleId = title!.Id;

        var existingAccountRating = await unitOfWork.AccountRatingRepository
            .GetByAccountAndTitleAsync(accountId, internalTitleId, cancellationToken); // EPC: Use internalTitleId
        
        if (existingAccountRating is not null)
            return Result<RatingDto>.Failure(AccountRatingErrors.DuplicateRating);
        
        await unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var accountRating = AccountRating.Create(
                accountId: accountId,
                titleId: internalTitleId, // EPC: Use internalTitleId
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
                TitleId: title!.LegacyId!, // EPC: Bridge back to string (LegacyId)
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

        // EPC: Bridge - Lookup Title to get LegacyId
        var title = await unitOfWork.TitleRepository.GetByIdAsync(rating.TitleId, cancellationToken);
        var legacyId = title?.LegacyId ?? rating.TitleId.ToString(); // Fallback if missing (shouldn't happen)

        var dto = new RatingDto(
            Id: rating.Id, 
            AccountId: rating.AccountId,
            TitleId: legacyId, // EPC: Mapped back to string
            Score: rating.Score,
            Comment: rating.Comment);
        
        
        return Result<RatingDto>.Success(dto);
    }
    
    public async Task<Result<List<RatingDto>>> GetRatingsAsync(Guid accountId, CancellationToken token)
    {
        var ratings = new List<RatingDto>();

        var ratingEntities = new List<AccountRating>();
        await foreach (var rating in unitOfWork.AccountRatingRepository.GetByAccountIdAsync(accountId).WithCancellation(token))
        {
            ratingEntities.Add(rating);
        }

        foreach (var rating in ratingEntities)
        {
            // EPC: Bridge - Lookup Title to get LegacyId
            var title = await unitOfWork.TitleRepository.GetByIdAsync(rating.TitleId, token);
            var legacyId = title?.LegacyId ?? rating.TitleId.ToString();

            var dto = new RatingDto(
                Id: rating.Id,
                AccountId: rating.AccountId,
                TitleId: legacyId, // EPC: Mapped back to string
                Score: rating.Score,
                Comment: rating.Comment);
            
            ratings.Add(dto);
        }
        
        return Result<List<RatingDto>>.Success(ratings);
    }

    public async Task<Result<RatingDto?>> GetRatingForTitleAsync(Guid accountId, string titleId, CancellationToken token)
    {
        // Resolve title ID (could be GUID or Legacy ID)
        Title? title = null;

        if (Guid.TryParse(titleId, out var parsedGuid))
        {
            title = await unitOfWork.TitleRepository.GetByIdAsync(parsedGuid, token);
        }

        if (title is null)
        {
            title = await unitOfWork.TitleRepository.GetByLegacyIdAsync(titleId, token);
        }

        if (title is null)
        {
            return Result<RatingDto?>.Success(null); // Title not found, no rating possible
        }

        var rating = await unitOfWork.AccountRatingRepository
            .GetByAccountAndTitleAsync(accountId, title.Id, token);

        if (rating is null)
        {
            return Result<RatingDto?>.Success(null); // No rating found
        }

        var dto = new RatingDto(
            Id: rating.Id,
            AccountId: rating.AccountId,
            TitleId: title.LegacyId ?? title.Id.ToString(),
            Score: rating.Score,
            Comment: rating.Comment);

        return Result<RatingDto?>.Success(dto);
    }

}