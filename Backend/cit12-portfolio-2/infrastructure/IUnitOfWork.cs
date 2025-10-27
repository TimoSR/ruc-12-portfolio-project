using domain.account.interfaces;
using domain.ratings;

namespace infrastructure;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    IAccountRepository AccountRepository { get; }
    IRatingRepository RatingRepository { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}