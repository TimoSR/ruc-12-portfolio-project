using domain.account;
using domain.account.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public sealed class AccountRepository : IAccountRepository
{
    private readonly MovieDbContext _dbContext;

    public AccountRepository(MovieDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var account = await _dbContext.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(a => a.Email == email, cancellationToken);

        // This call is allowed because of InternalsVisibleTo, in assemblyinfo
        return account;
    }

    public async Task<Account?> GetByUserNameAsync(string username, CancellationToken cancellationToken = default)
    {
        var account = await _dbContext.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(a => a.Username == username, cancellationToken);

        // This call is allowed because of InternalsVisibleTo, in assemblyinfo
        return account;
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task AddAsync(Account account, CancellationToken cancellationToken = default)
    {
        await _dbContext.Accounts.AddAsync(account, cancellationToken);
    }
    
    public async Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Accounts
            .AsNoTracking() // Optional: skip EF change tracking for read-only query
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }
}