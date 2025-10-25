using domain.movie;
using service_patterns;

namespace application.movieService;

public interface IMovieService
{
    Task<Result<MovieDto>> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<MovieLegacyDto>> GetMovieByLegacyIdAsync(string legacyId, CancellationToken cancellationToken);
    Task<Result<IEnumerable<MovieDto>>> SearchMoviesAsync(SearchMoviesQuery query, CancellationToken cancellationToken);
}
