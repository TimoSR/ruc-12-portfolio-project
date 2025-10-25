using domain.movie;
using infrastructure;
using Microsoft.Extensions.Logging;
using service_patterns;

namespace application.movieService;

public class MovieService(IUnitOfWork unitOfWork, ILogger<MovieService> logger) : IMovieService
{
    public async Task<Result<Movie>> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var movie = await unitOfWork.MovieRepository.GetByIdAsync(id, cancellationToken);

            if (movie is null)
            {
                return Result<Movie>.Failure(MovieErrors.NotFound);
            }

            return Result<Movie>.Success(movie);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving movie with id {MovieId}", id);
            throw;
        }
    }

    public async Task<Result<Movie>> GetMovieByLegacyIdAsync(string legacyId, CancellationToken cancellationToken)
    {
        try
        {
            var movie = await unitOfWork.MovieRepository.GetByLegacyIdAsync(legacyId, cancellationToken);

            if (movie is null)
            {
                return Result<Movie>.Failure(MovieErrors.NotFound);
            }

            return Result<Movie>.Success(movie);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving movie with legacy id {LegacyId}", legacyId);
            throw;
        }
    }

    public async Task<Result<IEnumerable<Movie>>> SearchMoviesAsync(SearchMoviesQuery query, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query.Query))
            {
                return Result<IEnumerable<Movie>>.Success(Enumerable.Empty<Movie>());
            }

            var movies = await unitOfWork.MovieRepository.SearchAsync(query.Query, query.Page, query.PageSize, cancellationToken);

            return Result<IEnumerable<Movie>>.Success(movies);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while searching movies with query {Query}", query.Query);
            throw;
        }
    }
}
