namespace domain.person.interfaces;

public sealed record PersonListItem(Guid Id, string PrimaryName);
public sealed record WordFrequencyItem(string Word, int Frequency);
public sealed record CoActorItem(Guid PersonId, string PrimaryName, long Frequency);
public sealed record PopularCoActorItem(Guid ActorId, string ActorFullname, decimal? WeightedRating);
public sealed record KnownForTitleItem(Guid TitleId);
public sealed record ProfessionItem(string Profession);

public interface IPersonQueriesRepository
{
    Task<(IEnumerable<PersonListItem> items, int totalCount)> SearchByNameAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<IEnumerable<WordFrequencyItem>> GetPersonWordsAsync(string personName, int limit, CancellationToken cancellationToken = default);
    Task<IEnumerable<CoActorItem>> GetCoActorsAsync(string personName, CancellationToken cancellationToken = default);
    Task<IEnumerable<PopularCoActorItem>> GetPopularCoActorsAsync(string personName, CancellationToken cancellationToken = default);
    Task<IEnumerable<KnownForTitleItem>> GetKnownForTitlesAsync(Guid personId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProfessionItem>> GetProfessionsAsync(Guid personId, CancellationToken cancellationToken = default);
}


