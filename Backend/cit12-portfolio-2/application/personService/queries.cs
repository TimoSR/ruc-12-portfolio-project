namespace application.personService;

public sealed record SearchPersonsQuery(string Query, int Page, int PageSize);
public sealed record PersonListItemDto(Guid Id, string PrimaryName);
public sealed record WordFrequencyDto(string Word, int Frequency);
public sealed record CoActorDto(Guid PersonId, string PrimaryName, long Frequency);
public sealed record PopularCoActorDto(Guid ActorId, string ActorFullname, decimal? WeightedRating);
public sealed record KnownForTitleDto(Guid TitleId);
public sealed record ProfessionDto(string Profession);


