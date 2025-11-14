using service_patterns;

namespace domain.movie.person.interfaces;

public interface IPersonRepository : IRepository<Person>
{
    Task<Person?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Person?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default);
    Task AddAsync(Person person, CancellationToken cancellationToken = default);
    Task<bool> ExistsByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default);
}


