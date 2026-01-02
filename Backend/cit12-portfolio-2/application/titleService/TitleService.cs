using domain.movie.title;
using domain.title;
using infrastructure;
using Microsoft.Extensions.Logging;
using service_patterns;

namespace application.titleService;

public class TitleService(IUnitOfWork unitOfWork, ILogger<TitleService> logger) : ITitleService
{
    public async Task<Result<TitleDto>> GetTitleByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var title = await unitOfWork.TitleRepository.GetByIdAsync(id, cancellationToken);

            if (title is null)
                return Result<TitleDto>.Failure(TitleErrors.NotFound);
            
            var dto = new TitleDto(
                Id: title.Id,
                LegacyId: title.LegacyId, // EPC: Mapped LegacyId
                TitleType: title.TitleType,
                PrimaryTitle: title.PrimaryTitle,
                OriginalTitle: title.OriginalTitle,
                IsAdult: title.IsAdult,
                StartYear: title.StartYear,
                EndYear: title.EndYear,
                RuntimeMinutes: title.RuntimeMinutes,
                PosterUrl: title.PosterUrl,
                Plot: title.Plot
            );

            return Result<TitleDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving title with id {TitleId}", id);
            throw;
        }
    }

    public async Task<Result<TitleLegacyDto>> GetTitleByLegacyIdAsync(string legacyId, CancellationToken cancellationToken)
    {
        try
        {
            var title = await unitOfWork.TitleRepository.GetByLegacyIdAsync(legacyId, cancellationToken);

            if(title is null)
                return Result<TitleLegacyDto>.Failure(TitleErrors.NotFound);
            
            var dto = new TitleLegacyDto(
                Id: title.Id,
                LegacyId: title.LegacyId!,
                TitleType: title.TitleType,
                PrimaryTitle: title.PrimaryTitle,
                OriginalTitle: title.OriginalTitle,
                IsAdult: title.IsAdult,
                StartYear: title.StartYear,
                EndYear: title.EndYear,
                RuntimeMinutes: title.RuntimeMinutes,
                PosterUrl: title.PosterUrl,
                Plot: title.Plot
            );

            return Result<TitleLegacyDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving title with legacy id {LegacyId}", legacyId);
            throw;
        }
    }

    public async Task<Result<(IEnumerable<TitleDto> items, int totalCount)>> SearchTitlesAsync(SearchTitlesQuery query, CancellationToken cancellationToken)
    {
        try
        {
            // Pass the actual query to repository (null-safe)
            var (titles, totalCount) = await unitOfWork.TitleRepository.SearchAsync(query.Query ?? "", query.Page, query.PageSize, cancellationToken);

            var dtos = titles.Select(title => new TitleDto(
                Id: title.Id,
                LegacyId: title.LegacyId,
                TitleType: title.TitleType,
                PrimaryTitle: title.PrimaryTitle,
                OriginalTitle: title.OriginalTitle,
                IsAdult: title.IsAdult,
                StartYear: title.StartYear,
                EndYear: title.EndYear,
                RuntimeMinutes: title.RuntimeMinutes,
                PosterUrl: title.PosterUrl,
                Plot: title.Plot
            ));

            return Result<(IEnumerable<TitleDto> items, int totalCount)>.Success((dtos, totalCount));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while searching titles with query {Query}", query.Query);
            throw;
        }
    }

    public async Task<Result<TitleDto>> CreateTitleAsync(CreateTitleCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);

            var title = Title.Create(
                titleType: command.TitleType,
                primaryTitle: command.PrimaryTitle,
                originalTitle: command.OriginalTitle,
                isAdult: command.IsAdult,
                startYear: command.StartYear,
                endYear: command.EndYear,
                runtimeMinutes: command.RuntimeMinutes,
                posterUrl: command.PosterUrl,
                plot: command.Plot
            );

            await unitOfWork.TitleRepository.AddAsync(title, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            var dto = new TitleDto(
                Id: title.Id,
                LegacyId: title.LegacyId,
                TitleType: title.TitleType,
                PrimaryTitle: title.PrimaryTitle,
                OriginalTitle: title.OriginalTitle,
                IsAdult: title.IsAdult,
                StartYear: title.StartYear,
                EndYear: title.EndYear,
                RuntimeMinutes: title.RuntimeMinutes,
                PosterUrl: title.PosterUrl,
                Plot: title.Plot
            );

            return Result<TitleDto>.Success(dto);
        }
        catch (Exception ex)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            logger.LogError(ex, "Unexpected error while creating title");
            throw;
        }
    }

    public async Task<Result<TitleDto>> UpdateTitleAsync(Guid id, UpdateTitleCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);

            var title = await unitOfWork.TitleRepository.GetByIdAsync(id, cancellationToken);
            if (title is null)
                return Result<TitleDto>.Failure(TitleErrors.NotFound);

            // Update properties using business methods
            if (!string.IsNullOrWhiteSpace(command.PrimaryTitle))
                title.ChangePrimaryTitle(command.PrimaryTitle);

            if (!string.IsNullOrWhiteSpace(command.OriginalTitle))
                title.ChangeOriginalTitle(command.OriginalTitle);

            if (command.StartYear.HasValue)
                title.ChangeStartYear(command.StartYear.Value);

            if (command.EndYear.HasValue)
                title.ChangeEndYear(command.EndYear);

            if (command.RuntimeMinutes.HasValue && command.RuntimeMinutes > 0)
                title.UpdateRuntimeMinutes(command.RuntimeMinutes.Value);

            if (!string.IsNullOrWhiteSpace(command.PosterUrl) || command.PosterUrl == null)
                title.UpdatePosterUrl(command.PosterUrl);

            if (!string.IsNullOrWhiteSpace(command.Plot))
                title.UpdatePlot(command.Plot);

            await unitOfWork.TitleRepository.UpdateAsync(title, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            var dto = new TitleDto(
                Id: title.Id,
                LegacyId: title.LegacyId,
                TitleType: title.TitleType,
                PrimaryTitle: title.PrimaryTitle,
                OriginalTitle: title.OriginalTitle,
                IsAdult: title.IsAdult,
                StartYear: title.StartYear,
                EndYear: title.EndYear,
                RuntimeMinutes: title.RuntimeMinutes,
                PosterUrl: title.PosterUrl,
                Plot: title.Plot
            );

            return Result<TitleDto>.Success(dto);
        }
        catch (Exception ex)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            logger.LogError(ex, "Unexpected error while updating title with id {TitleId}", id);
            throw;
        }
    }

    public async Task<Result> DeleteTitleAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);

            var title = await unitOfWork.TitleRepository.GetByIdAsync(id, cancellationToken);
            if (title is null)
                return Result.Failure(TitleErrors.NotFound);

            title.AddDomainEvent(new TitleDeletedDomainEvent(title.Id, title.PrimaryTitle));

            await unitOfWork.TitleRepository.DeleteAsync(id, cancellationToken);
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            logger.LogError(ex, "Unexpected error while deleting title with id {TitleId}", id);
            throw;
        }
    }


}
