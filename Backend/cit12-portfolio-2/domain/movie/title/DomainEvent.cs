using service_patterns;

namespace domain.title;

public record TitleCreatedDomainEvent(string Title) : DomainEvent;
public record TitleUpdatedDomainEvent(Guid TitleId, string Title) : DomainEvent;
public record TitleDeletedDomainEvent(Guid TitleId, string Title) : DomainEvent;