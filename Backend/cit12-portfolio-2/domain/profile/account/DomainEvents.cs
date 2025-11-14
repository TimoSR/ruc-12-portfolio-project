using service_patterns;

namespace domain.profile.account;

public record PasswordChangedEvent(Guid AccountId, DateTime ChangedAt) : DomainEvent;
public record EmailChangedEvent(Guid AccountId, string NewEmail, DateTime ChangedAt) : DomainEvent;
public record AccountCreatedEvent(string Email, string UserName, DateTime CreatedAt) : DomainEvent;