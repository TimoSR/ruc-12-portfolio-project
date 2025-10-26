using domain.account.ValueObjects;
using service_patterns;

namespace domain.account.interfaces;

// Defines a contract for account persistence operations. 
// This abstraction allows the domain layer to depend only on the interface, 
// while the actual implementation (e.g., database, API, cache) is provided by the infrastructure layer.

public interface IAccountRepository : IRepository<Account>
{
    Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<Account?> GetByUserNameAsync(string username, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Account account, CancellationToken cancellationToken = default);
    Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddRating(Rating rating, CancellationToken cancellationToken = default);
    Task<Rating?> GetRatingAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Rating>> GetRatingsAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateRating(Rating rating, CancellationToken cancellationToken = default);
}