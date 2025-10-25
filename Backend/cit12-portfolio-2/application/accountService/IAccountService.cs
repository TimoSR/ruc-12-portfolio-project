using domain.account;
using service_patterns;

namespace application.accountService;

public interface IAccountService
{
    Task<Result<AccountDto>> CreateAccountAsync(CreateAccountCommandDto commandDto, CancellationToken cancellationToken);
    Task<Result<AccountDto>> GetAccountByIdAsync(Guid id, CancellationToken cancellationToken);
}