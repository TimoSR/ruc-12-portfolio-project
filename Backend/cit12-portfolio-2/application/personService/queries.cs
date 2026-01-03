namespace application.personService;

public sealed record SearchPersonsQuery(string? Query, int Page = 1, int PageSize = 20);
public sealed record PersonListItemDto(Guid Id, string Nconst, string PrimaryName, string? Url = null);
public sealed record WordFrequencyDto(string Word, int Frequency);
public sealed record CoActorDto(Guid PersonId, string PrimaryName, long Frequency, string? Url = null);
public sealed record PopularCoActorDto(Guid ActorId, string ActorFullname, decimal? WeightedRating, string? Url = null);
public sealed record KnownForTitleDto(Guid TitleId, string PrimaryTitle, string? Url = null);
public sealed record ProfessionDto(string Profession);


