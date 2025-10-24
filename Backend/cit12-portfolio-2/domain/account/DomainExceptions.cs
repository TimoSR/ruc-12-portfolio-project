using service_patterns;

namespace domain.account;

public sealed class InvalidEmailException() : DomainException("Email is required.");
public sealed class InvalidUserNameException() : DomainException("Username is required.");
public sealed class InvalidPasswordException() : DomainException("Password is required.");
