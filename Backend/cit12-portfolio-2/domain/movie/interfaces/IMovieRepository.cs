using service_patterns;

namespace domain.movie.interfaces;

public interface IMovieRepository : IRepository<Movie>
{
    Task<Movie?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Movie?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Movie>> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default);
}
