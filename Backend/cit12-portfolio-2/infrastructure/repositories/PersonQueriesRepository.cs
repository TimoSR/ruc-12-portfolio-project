using System;
using System.Data;
using domain.movie.person.interfaces;
using Microsoft.EntityFrameworkCore;

namespace infrastructure.repositories;

public sealed class PersonQueriesRepository : IPersonQueriesRepository
{
    private readonly MovieDbContext _db;

    public PersonQueriesRepository(MovieDbContext db)
    {
        _db = db;
    }

    public async Task<(IEnumerable<PersonListItem> items, int totalCount)> SearchByNameAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var skip = (page - 1) * pageSize;

        // Simple ILIKE on primary_name with paging
        var queryable = _db.Persons
            .AsNoTracking()
            .Where(p => EF.Functions.ILike(p.PrimaryName, $"%{query}%"));
        
        var totalCount = await queryable.CountAsync(cancellationToken);
        
        var items = await queryable
            .OrderBy(p => p.PrimaryName)
            .Skip(skip)
            .Take(pageSize)
            .Select(p => new PersonListItem(p.Id, p.LegacyId, p.PrimaryName))
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<IEnumerable<WordFrequencyItem>> GetPersonWordsAsync(string personName, int limit, CancellationToken cancellationToken = default)
    {
        // Calls api.person_words(p_person_name, max_words)
        var conn = _db.Database.GetDbConnection();
        using var _ = await EnsureOpenAsync(conn, cancellationToken);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "select word, frequency from api.person_words(@pname, @max)";
        AddParam(cmd, "@pname", personName);
        AddParam(cmd, "@max", limit);

        var list = new List<WordFrequencyItem>();
        await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var word = reader.GetString(0);
            var freq = reader.GetInt32(1);
            list.Add(new WordFrequencyItem(word, freq));
        }
        return list;
    }

    public async Task<IEnumerable<CoActorItem>> GetCoActorsAsync(string personName, CancellationToken cancellationToken = default)
    {
        // Calls api.get_coplayers(p_actor_name)
        var conn = _db.Database.GetDbConnection();
        using var _ = await EnsureOpenAsync(conn, cancellationToken);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "select person_id, primary_name, frequency from api.get_coplayers(@pname)";
        AddParam(cmd, "@pname", personName);

        var list = new List<CoActorItem>();
        await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var id = reader.GetGuid(0);
            var name = reader.GetString(1);
            var freq = reader.GetInt64(2);
            list.Add(new CoActorItem(id, name, freq));
        }
        return list;
    }

    public async Task<IEnumerable<PopularCoActorItem>> GetPopularCoActorsAsync(string personName, CancellationToken cancellationToken = default)
    {
        // Calls api.get_popular_co_actors(p_actor_name)
        var conn = _db.Database.GetDbConnection();
        using var _ = await EnsureOpenAsync(conn, cancellationToken);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "select actor_id, actor_fullname, weighted_rating from api.get_popular_co_actors(@pname)";
        AddParam(cmd, "@pname", personName);

        var list = new List<PopularCoActorItem>();
        await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var id = reader.GetGuid(0);
            var name = reader.GetString(1);
            decimal? rating = reader.IsDBNull(2) ? null : reader.GetDecimal(2);
            list.Add(new PopularCoActorItem(id, name, rating));
        }
        return list;
    }

    public async Task<IEnumerable<KnownForTitleItem>> GetKnownForTitlesAsync(Guid personId, CancellationToken cancellationToken = default)
    {
        var conn = _db.Database.GetDbConnection();
        using var _ = await EnsureOpenAsync(conn, cancellationToken);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            select kf.title_id, t.primary_title 
            from movie_db.person_known_for kf
            join movie_db.title t on kf.title_id = t.id
            where kf.person_id = @pid";
        AddParam(cmd, "@pid", personId);

        var list = new List<KnownForTitleItem>();
        await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var tid = reader.GetGuid(0);
            var title = reader.GetString(1);
            list.Add(new KnownForTitleItem(tid, title));
        }
        return list;
    }

    public async Task<IEnumerable<ProfessionItem>> GetProfessionsAsync(Guid personId, CancellationToken cancellationToken = default)
    {
        var conn = _db.Database.GetDbConnection();
        using var _ = await EnsureOpenAsync(conn, cancellationToken);
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "select profession from movie_db.person_profession where person_id = @pid";
        AddParam(cmd, "@pid", personId);

        var list = new List<ProfessionItem>();
        await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var prof = reader.GetString(0);
            list.Add(new ProfessionItem(prof));
        }
        return list;
    }

    private static void AddParam(System.Data.Common.DbCommand cmd, string name, object? value)
    {
        var p = cmd.CreateParameter();
        p.ParameterName = name;
        p.Value = value ?? DBNull.Value;
        cmd.Parameters.Add(p);
    }

    private static async Task<IDisposable> EnsureOpenAsync(System.Data.Common.DbConnection conn, CancellationToken ct)
    {
        if (conn.State == ConnectionState.Open)
            return new Dummy(() => { });
        await conn.OpenAsync(ct);
        return new Dummy(() => conn.Close());
    }

    private sealed class Dummy : IDisposable
    {
        private readonly Action _onDispose;
        public Dummy(Action onDispose) { _onDispose = onDispose; }
        public void Dispose() { _onDispose(); }
    }
}


