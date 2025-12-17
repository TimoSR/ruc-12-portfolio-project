

using domain.movie.person.interfaces;
using domain.movie.title.interfaces;
using domain.profile.bookmark.interfaces;
using domain.movie.titleRatings;
using domain.profile.account.interfaces;
using domain.profile.accountRatings;
using Microsoft.EntityFrameworkCore.Storage;

namespace infrastructure;

public class UnitOfWork : IUnitOfWork
{
    public IAccountRepository AccountRepository { get; }
    public ITitleRepository TitleRepository { get; }
    public IAccountRatingRepository AccountRatingRepository { get; }
    public ITitleRatingRepository TitleRatingRepository { get; }
    public ITitleStatisticsRepository TitleStatisticsRepository { get; }
    public IPersonRepository PersonRepository { get; }
    public IPersonQueriesRepository PersonQueriesRepository { get; }
    public IBookmarkRepository BookmarkRepository { get; } // Added this property

    private readonly MovieDbContext _dbContext;
    private IDbContextTransaction? _currentTransaction;

    public UnitOfWork(
        MovieDbContext dbContext,
        IAccountRepository accountRepository,
        IAccountRatingRepository accountRatingRepository,
        ITitleRepository titleRepository,
        ITitleRatingRepository titleRatingRepository,
        ITitleStatisticsRepository titleStatisticsRepository,
        IPersonRepository personRepository,
        IPersonQueriesRepository personQueriesRepository,
        IBookmarkRepository bookmarkRepository) // Added this parameter
    {
        _dbContext = dbContext;
        AccountRepository = accountRepository;
        TitleRepository = titleRepository;
        AccountRatingRepository =  accountRatingRepository;
        TitleRatingRepository = titleRatingRepository;
        TitleStatisticsRepository = titleStatisticsRepository;
        PersonRepository = personRepository;
        PersonQueriesRepository = personQueriesRepository;
        BookmarkRepository = bookmarkRepository;
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
            return;

        _currentTransaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.RollbackAsync(cancellationToken);
            }
        }
        finally
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }

    public async ValueTask DisposeAsync()
    {
        await _dbContext.DisposeAsync();
    }
}