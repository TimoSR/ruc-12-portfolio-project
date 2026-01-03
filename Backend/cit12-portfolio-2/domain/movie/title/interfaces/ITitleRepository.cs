using domain.title;
using service_patterns;

namespace domain.movie.title.interfaces;

/// <summary>
/// DTO for similar movie results from the database
/// </summary>
public record SimilarMovieItem(Guid TitleId, string PrimaryTitle, double JaccardScore);

public interface ITitleRepository : IRepository<Title>
{
    Task<Title?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Title?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Title> items, int totalCount)> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Title> items, int totalCount)> StructuredSearchAsync(string? title, string? plot, string? character, string? name, int page, int pageSize, CancellationToken cancellationToken = default);
    Task AddAsync(Title title, CancellationToken cancellationToken = default);
    Task UpdateAsync(Title title, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<SimilarMovieItem>> GetSimilarMoviesAsync(Guid titleId, int limit = 10, CancellationToken cancellationToken = default);
}
