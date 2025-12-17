namespace domain.profile.bookmark;

public interface IBookmarkRepository
{
    Task<Bookmark?> GetAsync(Guid accountId, string targetId, CancellationToken cancellationToken);
    Task<IEnumerable<Bookmark>> GetAllAsync(Guid accountId, CancellationToken cancellationToken);
    Task AddAsync(Bookmark bookmark, CancellationToken cancellationToken);
    Task DeleteAsync(Bookmark bookmark, CancellationToken cancellationToken);
}
