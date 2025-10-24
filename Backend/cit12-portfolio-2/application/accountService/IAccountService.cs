using domain.account;
using service_patterns;

namespace application.accountService;

public interface IAccountService
{
    Task<Result<Account>> CreateAccountAsync(CreateAccountCommand command, CancellationToken cancellationToken);
    Task<Result<Account>> GetAccountByIdAsync(Guid id, CancellationToken cancellationToken);
}