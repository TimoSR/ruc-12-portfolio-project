using domain.account.interfaces;

namespace infrastructure;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    IAccountRepository AccountRepository { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}