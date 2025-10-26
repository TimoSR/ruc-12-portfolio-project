using domain.account;
using domain.account.interfaces;
using domain.account.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public sealed class AccountRepository : IAccountRepository
{
    private readonly MovieDbContext _context;

    public AccountRepository(MovieDbContext context)
    {
        _context = context;
    }
    
    public async Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var account = await _context.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(a => a.Email == email, cancellationToken);

        // This call is allowed because of InternalsVisibleTo, in assemblyinfo
        return account;
    }

    public async Task<Account?> GetByUserNameAsync(string username, CancellationToken cancellationToken = default)
    {
        var account = await _context.Accounts
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
        await _context.Accounts.AddAsync(account, cancellationToken);
    }
    
    public async Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Accounts
            .AsNoTracking() // Optional: skip EF change tracking for read-only query
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task AddRating(Rating rating, CancellationToken cancellationToken = default)
    {
        await _context.Ratings.AddAsync(rating, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Rating?> GetRatingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Ratings
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<List<Rating>> GetRatingsAsync(Guid accountId, CancellationToken cancellationToken = default)
    {
        return await _context.Ratings
            .AsNoTracking()
            .Where(r => r.AccountId == accountId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateRating(Rating rating, CancellationToken cancellationToken = default)
    {
        _context.Ratings.Update(rating);
        await _context.SaveChangesAsync(cancellationToken);
    }
}