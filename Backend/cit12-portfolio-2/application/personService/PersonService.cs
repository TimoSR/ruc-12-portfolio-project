using domain.movie.person;
using infrastructure;
using Microsoft.Extensions.Logging;
using service_patterns;

namespace application.personService;

public sealed class PersonService(IUnitOfWork uow, ILogger<PersonService> logger) : IPersonService
{
    public async Task<Result<PersonDto>> CreatePersonAsync(CreatePersonCommandDto command, CancellationToken cancellationToken)
    {
        var exists = await uow.PersonRepository.ExistsByLegacyIdAsync(command.LegacyId, cancellationToken);
        if (exists)
            return Result<PersonDto>.Failure(PersonErrors.DuplicateLegacyId);

        await uow.BeginTransactionAsync(cancellationToken);
        try
        {
            var person = Person.Create(command.LegacyId, command.PrimaryName, command.BirthYear, command.DeathYear);
            await uow.PersonRepository.AddAsync(person, cancellationToken);
            await uow.CommitTransactionAsync(cancellationToken);

            var dto = new PersonDto(person.Id, person.LegacyId, person.PrimaryName, person.BirthYear, person.DeathYear);
            return Result<PersonDto>.Success(dto);
        }
        catch (Exception ex)
        {
            await uow.RollbackTransactionAsync(cancellationToken);
            logger.LogError(ex, "Failed to create person {LegacyId}", command.LegacyId);
            throw;
        }
    }

    public async Task<Result<PersonDto>> GetPersonByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var person = await uow.PersonRepository.GetByIdAsync(id, cancellationToken);
            if (person is null)
                return Result<PersonDto>.Failure(PersonErrors.NotFound);

            var dto = new PersonDto(person.Id, person.LegacyId, person.PrimaryName, person.BirthYear, person.DeathYear);
            return Result<PersonDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error getting person {PersonId}", id);
            throw;
        }
    }

    public async Task<Result<PersonDto>> GetPersonByLegacyIdAsync(string legacyId, CancellationToken cancellationToken)
    {
        try
        {
            var person = await uow.PersonRepository.GetByLegacyIdAsync(legacyId, cancellationToken);
            if (person is null)
                return Result<PersonDto>.Failure(PersonErrors.NotFound);

            var dto = new PersonDto(person.Id, person.LegacyId, person.PrimaryName, person.BirthYear, person.DeathYear);
            return Result<PersonDto>.Success(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while retrieving person with legacy id {LegacyId}", legacyId);
            throw;
        }
    }

    public async Task<Result<(IEnumerable<PersonListItemDto> items, int totalCount)>> SearchPersonsAsync(SearchPersonsQuery query, CancellationToken cancellationToken)
    {
        try
        {
            var q = string.IsNullOrWhiteSpace(query.Query) ? string.Empty : query.Query.Trim();
            if (string.IsNullOrEmpty(q))
                return Result<(IEnumerable<PersonListItemDto> items, int totalCount)>.Success((Enumerable.Empty<PersonListItemDto>(), 0));

            var (items, totalCount) = await uow.PersonQueriesRepository
                .SearchByNameAsync(q, query.Page, query.PageSize, cancellationToken);

            var dtos = items.Select(x => new PersonListItemDto(x.Id, x.PrimaryName));
            return Result<(IEnumerable<PersonListItemDto> items, int totalCount)>.Success((dtos, totalCount));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error searching persons by name {Query}", query.Query);
            throw;
        }
    }

    public async Task<Result<IEnumerable<WordFrequencyDto>>> GetPersonWordsAsync(string personName, int limit, CancellationToken cancellationToken)
    {
        try
        {
            var items = await uow.PersonQueriesRepository.GetPersonWordsAsync(personName, limit, cancellationToken);
            var dtos = items.Select(x => new WordFrequencyDto(x.Word, x.Frequency));
            return Result<IEnumerable<WordFrequencyDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting words for {Name}", personName);
            throw;
        }
    }

    public async Task<Result<IEnumerable<CoActorDto>>> GetCoActorsAsync(string personName, CancellationToken cancellationToken)
    {
        try
        {
            var items = await uow.PersonQueriesRepository.GetCoActorsAsync(personName, cancellationToken);
            var dtos = items.Select(x => new CoActorDto(x.PersonId, x.PrimaryName, x.Frequency));
            return Result<IEnumerable<CoActorDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting co-actors for {Name}", personName);
            throw;
        }
    }

    public async Task<Result<IEnumerable<PopularCoActorDto>>> GetPopularCoActorsAsync(string personName, CancellationToken cancellationToken)
    {
        try
        {
            var items = await uow.PersonQueriesRepository.GetPopularCoActorsAsync(personName, cancellationToken);
            var dtos = items.Select(x => new PopularCoActorDto(x.ActorId, x.ActorFullname, x.WeightedRating));
            return Result<IEnumerable<PopularCoActorDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting popular co-actors for {Name}", personName);
            throw;
        }
    }

    public async Task<Result<IEnumerable<KnownForTitleDto>>> GetKnownForTitlesAsync(Guid personId, CancellationToken cancellationToken)
    {
        try
        {
            var items = await uow.PersonQueriesRepository.GetKnownForTitlesAsync(personId, cancellationToken);
            var dtos = items.Select(x => new KnownForTitleDto(x.TitleId));
            return Result<IEnumerable<KnownForTitleDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting known-for titles for {PersonId}", personId);
            throw;
        }
    }

    public async Task<Result<IEnumerable<ProfessionDto>>> GetProfessionsAsync(Guid personId, CancellationToken cancellationToken)
    {
        try
        {
            var items = await uow.PersonQueriesRepository.GetProfessionsAsync(personId, cancellationToken);
            var dtos = items.Select(x => new ProfessionDto(x.Profession));
            return Result<IEnumerable<ProfessionDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting professions for {PersonId}", personId);
            throw;
        }
    }
}


