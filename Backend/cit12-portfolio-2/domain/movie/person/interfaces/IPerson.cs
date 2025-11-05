using service_patterns;

namespace domain.movie.person.interfaces;

public interface IPerson : IAggregateRoot
{
    Guid Id { get; }
    string LegacyId { get; }
    string PrimaryName { get; }
    int? BirthYear { get; }
    int? DeathYear { get; }

    void ChangePrimaryName(string newName);
    static abstract Person Create(string legacyId, string primaryName, int? birthYear, int? deathYear);
}


