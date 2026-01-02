namespace domain.profile.bookmarks;

public interface IBookmarkRepository
{
    Task<Bookmark?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IEnumerable<Bookmark>> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken);
    Task<Bookmark?> GetByUserAndTargetAsync(Guid accountId, Guid targetId, CancellationToken cancellationToken);
    Task AddAsync(Bookmark bookmark, CancellationToken cancellationToken);
    Task DeleteAsync(Bookmark bookmark, CancellationToken cancellationToken);
}
