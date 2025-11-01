namespace application.personService;

public sealed record CreatePersonCommandDto(
    string LegacyId,
    string PrimaryName,
    int? BirthYear,
    int? DeathYear
);

public sealed record PersonDto(
    Guid Id,
    string LegacyId,
    string PrimaryName,
    int? BirthYear,
    int? DeathYear
);


