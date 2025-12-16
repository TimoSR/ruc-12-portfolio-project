using service_patterns;

namespace application.accountService;

public interface IAccountService
{
    Task<Result<AccountDto>> CreateAccountAsync(CreateAccountCommandDto commandDto, CancellationToken cancellationToken);
    Task<Result<AccountDto>> LoginAsync(LoginCommandDto commandDto, CancellationToken cancellationToken);
    Task<Result<AccountDto>> GetAccountByIdAsync(Guid id, CancellationToken cancellationToken);
}