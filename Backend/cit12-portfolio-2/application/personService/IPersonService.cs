using service_patterns;

namespace application.personService;

public interface IPersonService
{
    Task<Result<PersonDto>> CreatePersonAsync(CreatePersonCommandDto command, CancellationToken cancellationToken);
    Task<Result<PersonDto>> GetPersonByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<PersonDto>> GetPersonByLegacyIdAsync(string legacyId, CancellationToken cancellationToken);
    Task<Result<IEnumerable<PersonListItemDto>>> SearchPersonsAsync(SearchPersonsQuery query, CancellationToken cancellationToken);
    Task<Result<IEnumerable<WordFrequencyDto>>> GetPersonWordsAsync(string personName, int limit, CancellationToken cancellationToken);
    Task<Result<IEnumerable<CoActorDto>>> GetCoActorsAsync(string personName, CancellationToken cancellationToken);
    Task<Result<IEnumerable<PopularCoActorDto>>> GetPopularCoActorsAsync(string personName, CancellationToken cancellationToken);
    Task<Result<IEnumerable<KnownForTitleDto>>> GetKnownForTitlesAsync(Guid personId, CancellationToken cancellationToken);
    Task<Result<IEnumerable<ProfessionDto>>> GetProfessionsAsync(Guid personId, CancellationToken cancellationToken);
}


