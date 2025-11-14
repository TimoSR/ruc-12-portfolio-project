using service_patterns;

namespace domain.title;

public sealed class InvalidLegacyIdException() : DomainException("LegacyId is required.");
public sealed class InvalidPrimaryTitleException() : DomainException("PrimaryTitle is required.");
public sealed class InvalidTitleTypeException() : DomainException("TitleType is required.");
public sealed class TitleNotFoundException(Guid titleId) : DomainException($"Account with ID '{titleId}' was not found.");
