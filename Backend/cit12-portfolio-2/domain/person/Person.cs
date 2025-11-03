using service_patterns;
using domain.person.interfaces;

namespace domain.person;

public sealed class Person : AggregateRoot, IPerson
{
    public Guid Id { get; private set; }
    public string LegacyId { get; private set; }
    public string PrimaryName { get; private set; }
    public int? BirthYear { get; private set; }
    public int? DeathYear { get; private set; }

    internal Person(Guid id, string legacyId, string primaryName, int? birthYear, int? deathYear)
    {
        Id = id;
        LegacyId = legacyId;
        PrimaryName = primaryName;
        BirthYear = birthYear;
        DeathYear = deathYear;
    }

    private Person(string legacyId, string primaryName, int? birthYear, int? deathYear)
    {
        if (string.IsNullOrWhiteSpace(legacyId))
            throw new InvalidLegacyIdException();
        if (string.IsNullOrWhiteSpace(primaryName))
            throw new InvalidPrimaryNameException();

        LegacyId = legacyId.Trim();
        PrimaryName = primaryName.Trim();
        BirthYear = birthYear;
        DeathYear = deathYear;

        AddDomainEvent(new PersonCreatedEvent(LegacyId, PrimaryName));
    }

    public static Person Create(string legacyId, string primaryName, int? birthYear, int? deathYear)
    {
        return new Person(legacyId, primaryName, birthYear, deathYear);
    }

    public void ChangePrimaryName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new InvalidPrimaryNameException();

        newName = newName.Trim();
        if (string.Equals(newName, PrimaryName, StringComparison.Ordinal))
            return;

        PrimaryName = newName;
        AddDomainEvent(new PersonNameChangedEvent(Id, PrimaryName));
    }
}

public sealed class InvalidLegacyIdException : DomainException
{
    public InvalidLegacyIdException() : base("Person.InvalidLegacyId") {}
}

public sealed class InvalidPrimaryNameException : DomainException
{
    public InvalidPrimaryNameException() : base("Person.InvalidPrimaryName") {}
}

public sealed record PersonCreatedEvent(string LegacyId, string PrimaryName) : DomainEvent;
public sealed record PersonNameChangedEvent(Guid PersonId, string NewName) : DomainEvent;


