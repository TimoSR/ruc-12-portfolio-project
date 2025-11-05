using service_patterns;

namespace domain.movie.person;

public static class PersonErrors
{
    public static readonly Error DuplicateLegacyId = new("Person.DuplicateLegacyId", "A person with this legacy id already exists.");
    public static readonly Error NotFound = new("Person.NotFound", "Person not found.");
}


