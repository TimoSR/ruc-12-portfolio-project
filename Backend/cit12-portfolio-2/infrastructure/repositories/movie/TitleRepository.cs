using domain.movie.title;
using domain.movie.title.interfaces;
using domain.title;
using domain.title.interfaces;
using Microsoft.EntityFrameworkCore;
using System.Data;


namespace infrastructure.repositories.movie;

public sealed class TitleRepository(MovieDbContext dbContext) : ITitleRepository
{
    public async Task<Title?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Titles
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Title?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Titles
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.LegacyId == legacyId, cancellationToken);
    }

    public async Task<(IEnumerable<Title> items, int totalCount)> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var skip = (page - 1) * pageSize;
        
        IQueryable<Title> baseQuery;
        
        // If query is empty, return all titles (for debugging)
        if (string.IsNullOrWhiteSpace(query))
        {
            baseQuery = dbContext.Titles.AsNoTracking();
            
            var count = await baseQuery.CountAsync(cancellationToken);
            
            var items = await baseQuery
                .OrderBy(m => m.PrimaryTitle)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
            
            return (items, count);
        }
        
        var lowerQuery = query.ToLower();

        var rankedQuery = dbContext.Titles
            .AsNoTracking()
            .Where(t =>
                EF.Functions.ILike(t.PrimaryTitle, $"%{query}%") ||
                (t.OriginalTitle != null && EF.Functions.ILike(t.OriginalTitle, $"%{query}%")) ||
                (t.Plot != null && EF.Functions.ILike(t.Plot, $"%{query}%"))
            )
            .Select(t => new
            {
                Title = t,
                Rank =
                    (t.PrimaryTitle.ToLower() == lowerQuery ? 4.0 : 0.0) +                   // exact title match
                    (t.PrimaryTitle.ToLower().StartsWith(lowerQuery) ? 2.0 : 0.0) +          // prefix match
                    (t.PrimaryTitle.ToLower().Contains(lowerQuery) ? 1.0 : 0.0) +            // substring match
                    (t.OriginalTitle != null && t.OriginalTitle.ToLower() == lowerQuery ? 1.5 : 0.0) + // exact original match
                    (t.OriginalTitle != null && t.OriginalTitle.ToLower().Contains(lowerQuery) ? 0.5 : 0.0) +
                    (t.Plot != null && t.Plot.ToLower().Contains(lowerQuery) ? 0.2 : 0.0)    // weak plot influence
            });

        // Count total before applying Skip/Take
        var totalCount = await rankedQuery.CountAsync(cancellationToken);
        
        var results = await rankedQuery
            .OrderByDescending(x => x.Rank)
            .ThenBy(x => x.Title.PrimaryTitle)  // tie-break by title
            .Skip(skip)
            .Take(pageSize)
            .Select(x => x.Title)
            .ToListAsync(cancellationToken);

        return (results, totalCount);
    }

    public async Task<(IEnumerable<Title> items, int totalCount)> StructuredSearchAsync(string? title, string? plot, string? character, string? name, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var conn = dbContext.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open)
            await conn.OpenAsync(cancellationToken);

        // Calculate count first
        await using var countCmd = conn.CreateCommand();
        countCmd.CommandText = @"
            SELECT COUNT(DISTINCT t.id)
            FROM movie_db.title t
            LEFT JOIN movie_db.actor a ON t.id = a.title_id
            LEFT JOIN movie_db.person p ON a.person_id = p.id
            WHERE
              (@title::text IS NULL OR t.primary_title ILIKE '%' || @title || '%') AND
              (@plot::text IS NULL OR t.plot ILIKE '%' || @plot || '%') AND
              (@character::text IS NULL OR a.character_name ILIKE '%' || @character || '%') AND
              (@name::text IS NULL OR p.primary_name ILIKE '%' || @name || '%')";

        AddParam(countCmd, "@title", title);
        AddParam(countCmd, "@plot", plot);
        AddParam(countCmd, "@character", character);
        AddParam(countCmd, "@name", name);

        var countResult = await countCmd.ExecuteScalarAsync(cancellationToken);
        var totalCount = Convert.ToInt32(countResult);

        if (totalCount == 0)
            return (Enumerable.Empty<Title>(), 0);

        // Fetch items
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT DISTINCT t.id, t.legacy_id, t.title_type, t.primary_title, t.original_title, t.is_adult, t.start_year, t.end_year, t.runtime_minutes, t.poster_url, t.plot
            FROM movie_db.title t
            LEFT JOIN movie_db.actor a ON t.id = a.title_id
            LEFT JOIN movie_db.person p ON a.person_id = p.id
            WHERE
              (@title::text IS NULL OR t.primary_title ILIKE '%' || @title || '%') AND
              (@plot::text IS NULL OR t.plot ILIKE '%' || @plot || '%') AND
              (@character::text IS NULL OR a.character_name ILIKE '%' || @character || '%') AND
              (@name::text IS NULL OR p.primary_name ILIKE '%' || @name || '%')
            ORDER BY t.primary_title
            LIMIT @limit OFFSET @offset";

        AddParam(cmd, "@title", title);
        AddParam(cmd, "@plot", plot);
        AddParam(cmd, "@character", character);
        AddParam(cmd, "@name", name);
        AddParam(cmd, "@limit", pageSize);
        AddParam(cmd, "@offset", (page - 1) * pageSize);

        var items = new List<Title>();
        await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            // Map raw SQL result to Title entity (using internal constructor via reflection or manual mapping)
            // Since Title constructor is internal/private, we might need a workaround or just map to DTO if possible.
            // But Repository returns Domain Entities.
            // WORKAROUND: We will use the DbContext to attach/track if possible, or just reconstruct.
            // Since we can't easily access the internal constructor from outside the assembly without InternalsVisibleTo (which we likely have),
            // let's check Program.cs or AssemblyInfo. If not, we can use reflection.
            
            // Assuming InternalsVisibleTo is set or we can use reflection.
            var id = reader.GetGuid(0);
            var legacyId = reader.IsDBNull(1) ? string.Empty : reader.GetString(1);
            var titleType = reader.IsDBNull(2) ? string.Empty : reader.GetString(2);
            var primaryTitle = reader.IsDBNull(3) ? string.Empty : reader.GetString(3);
            var originalTitle = reader.IsDBNull(4) ? primaryTitle : reader.GetString(4);
            var isAdult = !reader.IsDBNull(5) && reader.GetBoolean(5);
            var startYear = reader.IsDBNull(6) ? (int?)null : reader.GetInt32(6);
            var endYear = reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7);
            var runtime = reader.IsDBNull(8) ? (int?)null : reader.GetInt32(8);
            var poster = reader.IsDBNull(9) ? null : reader.GetString(9);
            var plotRes = reader.IsDBNull(10) ? null : reader.GetString(10);
            
            // Use reflection to instantiate Title since constructor is internal
            // Note: This relies on the internal constructor matching this signature
            var titleObj = (Title)Activator.CreateInstance(
                typeof(Title),
                System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic,
                null,
                new object?[] { id, legacyId, titleType, primaryTitle, originalTitle, isAdult, startYear, endYear, runtime, poster, plotRes },
                null)!;
                
            items.Add(titleObj);
        }

        return (items, totalCount);
    }
    
    private static void AddParam(System.Data.Common.DbCommand cmd, string name, object? value)
    {
        var p = cmd.CreateParameter();
        p.ParameterName = name;
        p.Value = value ?? DBNull.Value;
        cmd.Parameters.Add(p);
    }

    public async Task AddAsync(Title title, CancellationToken cancellationToken = default)
    {
        await dbContext.Titles.AddAsync(title, cancellationToken);
    }

    public Task UpdateAsync(Title title, CancellationToken cancellationToken = default)
    {
        dbContext.Titles.Update(title);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var title = await dbContext.Titles.FindAsync(new object[] { id }, cancellationToken);
        if (title != null)
        {
            dbContext.Titles.Remove(title);
        }
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Titles.AnyAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<SimilarMovieItem>> GetSimilarMoviesAsync(Guid titleId, int limit = 10, CancellationToken cancellationToken = default)
    {
        // Call api.get_similar_movies(p_title_id, p_limit) DB function
        var conn = dbContext.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open)
            await conn.OpenAsync(cancellationToken);

        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT sim_title_id, primary_title, jaccard_genre FROM api.get_similar_movies(@ptid, @plimit)";
        
        var tidParam = cmd.CreateParameter();
        tidParam.ParameterName = "@ptid";
        tidParam.Value = titleId;
        cmd.Parameters.Add(tidParam);

        var limitParam = cmd.CreateParameter();
        limitParam.ParameterName = "@plimit";
        limitParam.Value = limit;
        cmd.Parameters.Add(limitParam);

        var results = new List<SimilarMovieItem>();
        await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var simTitleId = reader.GetGuid(0);
            var primaryTitle = reader.GetString(1);
            var jaccard = reader.IsDBNull(2) ? 0.0 : reader.GetDouble(2);
            results.Add(new SimilarMovieItem(simTitleId, primaryTitle, jaccard));
        }

        return results;
    }
}

