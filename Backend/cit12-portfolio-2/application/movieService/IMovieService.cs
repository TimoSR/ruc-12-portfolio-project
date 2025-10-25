using domain.movie;
using service_patterns;

namespace application.movieService;

public interface IMovieService
{
    Task<Result<Movie>> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<Movie>> GetMovieByLegacyIdAsync(string legacyId, CancellationToken cancellationToken);
    Task<Result<IEnumerable<Movie>>> SearchMoviesAsync(SearchMoviesQuery query, CancellationToken cancellationToken);
}
