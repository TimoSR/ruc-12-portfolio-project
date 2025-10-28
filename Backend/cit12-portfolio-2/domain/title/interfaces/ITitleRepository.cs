using service_patterns;

namespace domain.title.interfaces;

public interface ITitleRepository : IRepository<Title>
{
    Task<Title?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Title?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Title>> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default);
    Task AddAsync(Title title, CancellationToken cancellationToken = default);
    Task UpdateAsync(Title title, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
}
