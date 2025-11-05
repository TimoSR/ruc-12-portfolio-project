using service_patterns;

namespace domain.profile.account;

public sealed class InvalidEmailException() : DomainException("Email is required.");
public sealed class InvalidUserNameException() : DomainException("Username is required.");
public sealed class InvalidPasswordException() : DomainException("Password is required.");
public sealed class AccountNotFoundException(Guid accountId) : DomainException($"Account with ID '{accountId}' was not found.");
