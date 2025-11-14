using domain.profile.account;
using domain.profile.account.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories.profile;

public sealed class AccountRepository(MovieDbContext context) : IAccountRepository
{
    public async Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var account = await context.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(a => a.Email == email, cancellationToken);

        // This call is allowed because of InternalsVisibleTo, in assemblyinfo
        return account;
    }

    public async Task<Account?> GetByUserNameAsync(string username, CancellationToken cancellationToken = default)
    {
        var account = await context.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(a => a.Username == username, cancellationToken);

        // This call is allowed because of InternalsVisibleTo, in assemblyinfo
        return account;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Accounts
            .AsNoTracking()
            .AnyAsync(r => r.Id == id, cancellationToken);
    }

    public async Task AddAsync(Account account, CancellationToken cancellationToken = default)
    {
        await context.Accounts.AddAsync(account, cancellationToken);
    }
    
    public async Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await context.Accounts
            .AsNoTracking() // Optional: skip EF change tracking for read-only query
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }
}