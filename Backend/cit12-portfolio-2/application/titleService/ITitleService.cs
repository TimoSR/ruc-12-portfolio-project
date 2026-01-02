using domain.movie.title.interfaces;
using domain.title;
using service_patterns;

namespace application.titleService;

public interface ITitleService
{
    Task<Result<TitleDto>> GetTitleByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<TitleLegacyDto>> GetTitleByLegacyIdAsync(string legacyId, CancellationToken cancellationToken);
    Task<Result<(IEnumerable<TitleDto> items, int totalCount)>> SearchTitlesAsync(SearchTitlesQuery query, CancellationToken cancellationToken);
    Task<Result<TitleDto>> CreateTitleAsync(CreateTitleCommand command, CancellationToken cancellationToken);
    Task<Result<TitleDto>> UpdateTitleAsync(Guid id, UpdateTitleCommand command, CancellationToken cancellationToken);
    Task<Result> DeleteTitleAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<IEnumerable<SimilarMovieDto>>> GetSimilarMoviesAsync(Guid titleId, int limit, CancellationToken cancellationToken);
}

/// <summary>
/// DTO for similar movies exposed via API
/// </summary>
public record SimilarMovieDto(Guid TitleId, string PrimaryTitle, double Similarity);

