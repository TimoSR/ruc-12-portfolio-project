using domain.account.interfaces;
using domain.title.interfaces;

namespace infrastructure;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    IAccountRepository AccountRepository { get; }
    ITitleRepository TitleRepository { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}