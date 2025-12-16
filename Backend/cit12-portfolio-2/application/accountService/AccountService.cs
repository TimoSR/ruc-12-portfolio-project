using domain.profile.account;
using infrastructure;
using Microsoft.Extensions.Logging;

using service_patterns;
using application.services;

namespace application.accountService;

public class AccountService(IUnitOfWork unitOfWork, ILogger<AccountService> logger, ITokenService tokenService) : IAccountService
{
    public async Task<Result<AccountDto>> CreateAccountAsync(CreateAccountCommandDto commandDto, CancellationToken cancellationToken)
    {
        // 1. Check for existing account with the same username or email concurrently
        var existingUsername = await unitOfWork.AccountRepository
            .GetByUserNameAsync(commandDto.Username, cancellationToken);

        var existingEmail = await unitOfWork.AccountRepository
            .GetByEmailAsync(commandDto.Email, cancellationToken);

        if (existingUsername is not null)
            return Result<AccountDto>.Failure(AccountErrors.DuplicateUsername);

        if (existingEmail is not null)
            return Result<AccountDto>.Failure(AccountErrors.DuplicateEmail);

        // 2. Begin transaction
        await unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            // 3. Create account via factory
            var newAccount = Account.Create(
                email: commandDto.Email,
                username: commandDto.Username,
                password: commandDto.Password
            );

            // 4. Persist the new account
            await unitOfWork.AccountRepository.AddAsync(newAccount, cancellationToken);

            // 5. Commit transaction
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            // 6. We can now add return id after the commit, due to the object being tracked by dbContext
            var dto = new AccountDto(Id: newAccount.Id, Username: newAccount.Username);

            // 7. Return the created account as a successful result
            return Result<AccountDto>.Success(dto);
        }
        catch (Exception ex)
        {
            // Rollback and log on failure
            await unitOfWork.RollbackTransactionAsync(cancellationToken);
            logger.LogError(ex, "Error creating account for {Email}", commandDto.Email);

            // Let global exception middleware handle the failure
            throw;
        }
    }
    
    public async Task<Result<AccountDto>> GetAccountByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var account = await unitOfWork.AccountRepository.GetByIdAsync(id, cancellationToken);
            
            if (account is null)
                return Result<AccountDto>.Failure(AccountErrors.NotFound);
            
            var dto = new AccountDto(Id: account.Id, Username: account.Username);

            return Result<AccountDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving account with id {AccountId}", id);
            throw;
        }
    }


    public async Task<Result<AccountDto>> LoginAsync(LoginCommandDto commandDto, CancellationToken cancellationToken)
    {
        var account = await unitOfWork.AccountRepository.GetByUserNameAsync(commandDto.Username, cancellationToken);

        if (account == null)
        {
            return Result<AccountDto>.Failure(AccountErrors.NotFound);
        }

        // WARNING: Plain text password comparison for "last fix" scenario. NOT SECURE.
        if (account.Password != commandDto.Password)
        {
            return Result<AccountDto>.Failure(AccountErrors.InvalidCredentials);
        }

        var token = tokenService.CreateToken(account);

        return Result<AccountDto>.Success(new AccountDto(account.Id, account.Username, token));
    }
}