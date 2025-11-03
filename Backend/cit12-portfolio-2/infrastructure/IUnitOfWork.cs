using domain.account.interfaces;
using domain.title.interfaces;
using domain.ratings;
using domain.person.interfaces;

namespace infrastructure;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    IAccountRepository AccountRepository { get; }
    ITitleRepository TitleRepository { get; }
    IRatingRepository RatingRepository { get; }
    IPersonRepository PersonRepository { get; }
    IPersonQueriesRepository PersonQueriesRepository { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}