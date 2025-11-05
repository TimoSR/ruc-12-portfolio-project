using domain.movie.person;
using domain.movie.person.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public sealed class PersonRepository : IPersonRepository
{
    private readonly MovieDbContext _db;

    public PersonRepository(MovieDbContext db)
    {
        _db = db;
    }

    public async Task<Person?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _db.Persons
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Person?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
    {
        return await _db.Persons
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.LegacyId == legacyId, cancellationToken);
    }

    public async Task AddAsync(Person person, CancellationToken cancellationToken = default)
    {
        await _db.Persons.AddAsync(person, cancellationToken);
    }

    public async Task<bool> ExistsByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
    {
        return await _db.Persons
            .AsNoTracking()
            .AnyAsync(p => p.LegacyId == legacyId, cancellationToken);
    }
}


