using domain.account;
using infrastructure;
using Microsoft.Extensions.Logging;
using service_patterns;

namespace application.accountService;

public class AccountService(IUnitOfWork unitOfWork, ILogger<AccountService> logger) : IAccountService
{
    public async Task<Result<Account>> CreateAccountAsync(CreateAccountCommand command, CancellationToken cancellationToken)
    {
        // 1. Check for existing account with the same username or email concurrently
        var existingUsername = await unitOfWork.AccountRepository
            .GetByUserNameAsync(command.Username, cancellationToken);

        var existingEmail = await unitOfWork.AccountRepository
            .GetByEmailAsync(command.Email, cancellationToken);

        if (existingUsername is not null)
        {
            return Result<Account>.Failure(AccountErrors.DuplicateUsername);
        }

        if (existingEmail is not null)
        {
            return Result<Account>.Failure(AccountErrors.DuplicateEmail);
        }

        // 2. Begin transaction
        await unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            // 3. Create account via factory
            var newAccount = Account.Create(
                email: command.Email,
                username: command.Username,
                password: command.Password
            );

            // 4. Persist the new account
            await unitOfWork.AccountRepository.AddAsync(newAccount, cancellationToken);

            // 5. Commit transaction
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            // 6. Return the created account as a successful result
            return Result<Account>.Success(newAccount);
        }
        catch (Exception ex)
        {
            // Rollback and log on failure
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            logger.LogError(ex, "Error creating account for {Email}", command.Email);

            // Let global exception middleware handle the failure
            throw;
        }
    }
    
    public async Task<Result<Account>> GetAccountByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var account = await unitOfWork.AccountRepository.GetByIdAsync(id, cancellationToken);

            return Result<Account>.Success(account!);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving account with id {AccountId}", id);
            throw;
        }
    }
}