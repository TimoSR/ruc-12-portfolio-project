using service_patterns;

namespace domain.movie;

public record MovieCreatedDomainEvent(string Title) : DomainEvent;