using service_patterns;

namespace domain.person.interfaces;

public interface IPersonRepository : IRepository<domain.person.Person>
{
    Task<domain.person.Person?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<domain.person.Person?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default);
    Task AddAsync(domain.person.Person person, CancellationToken cancellationToken = default);
    Task<bool> ExistsByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default);
}


