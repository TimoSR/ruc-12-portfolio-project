using domain.movie;
using infrastructure;
using Microsoft.Extensions.Logging;
using service_patterns;

namespace application.movieService;

public class MovieService(IUnitOfWork unitOfWork, ILogger<MovieService> logger) : IMovieService
{
    public async Task<Result<MovieDto>> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var movie = await unitOfWork.MovieRepository.GetByIdAsync(id, cancellationToken);

            if (movie is null)
                return Result<MovieDto>.Failure(MovieErrors.NotFound);
            
            var dto = new MovieDto(
                Id: movie.Id,
                TitleType: movie.TitleType,
                PrimaryTitle: movie.PrimaryTitle,
                OriginalTitle: movie.OriginalTitle,
                IsAdult: movie.IsAdult,
                StartYear: movie.StartYear,
                EndYear: movie.EndYear,
                RuntimeMinutes: movie.RuntimeMinutes,
                PosterUrl: movie.PosterUrl,
                Plot: movie.Plot
            );

            return Result<MovieDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving movie with id {MovieId}", id);
            throw;
        }
    }

    public async Task<Result<MovieLegacyDto>> GetMovieByLegacyIdAsync(string legacyId, CancellationToken cancellationToken)
    {
        try
        {
            var movie = await unitOfWork.MovieRepository.GetByLegacyIdAsync(legacyId, cancellationToken);

            if(movie is null)
                return Result<MovieLegacyDto>.Failure(MovieErrors.NotFound);
            
            var dto = new MovieLegacyDto(
                Id: movie.Id,
                LegacyId: movie.LegacyId!,
                TitleType: movie.TitleType,
                PrimaryTitle: movie.PrimaryTitle,
                OriginalTitle: movie.OriginalTitle,
                IsAdult: movie.IsAdult,
                StartYear: movie.StartYear,
                EndYear: movie.EndYear,
                RuntimeMinutes: movie.RuntimeMinutes,
                PosterUrl: movie.PosterUrl,
                Plot: movie.Plot
            );

            return Result<MovieLegacyDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving movie with legacy id {LegacyId}", legacyId);
            throw;
        }
    }

    public async Task<Result<IEnumerable<MovieDto>>> SearchMoviesAsync(SearchMoviesQuery query, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query.Query))
            {
                return Result<IEnumerable<MovieDto>>.Success(Enumerable.Empty<MovieDto>());
            }

            var movies = await unitOfWork.MovieRepository.SearchAsync(query.Query, query.Page, query.PageSize, cancellationToken);

            var dtos = movies.Select(movie => new MovieDto(
                Id: movie.Id,
                TitleType: movie.TitleType,
                PrimaryTitle: movie.PrimaryTitle,
                OriginalTitle: movie.OriginalTitle,
                IsAdult: movie.IsAdult,
                StartYear: movie.StartYear,
                EndYear: movie.EndYear,
                RuntimeMinutes: movie.RuntimeMinutes,
                PosterUrl: movie.PosterUrl,
                Plot: movie.Plot
            ));

            return Result<IEnumerable<MovieDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while searching movies with query {Query}", query.Query);
            throw;
        }
    }

}
