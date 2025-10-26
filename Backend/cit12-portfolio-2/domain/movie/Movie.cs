using domain.movie.interfaces;
using service_patterns;

namespace domain.movie;

public class Movie : AggregateRoot, IMovie
{
    public Guid Id { get; private set; }
    public string LegacyId { get; private set; }
    public string TitleType { get; private set; }
    public string PrimaryTitle { get; private set; }
    public string OriginalTitle { get; private set; }
    public bool IsAdult { get; private set; }
    public int StartYear { get; private set; }
    public int? EndYear { get; private set; }
    public int RuntimeMinutes { get; private set; }
    public string? PosterUrl { get; private set; }
    public string Plot { get; private set; }

    // Is used for the database
    internal Movie(
        Guid id, 
        string legacyId, 
        string titleType, 
        string primaryTitle,
        string originalTitle,
        bool isAdult,
        int startYear,
        int? endYear,
        int runtimeMinutes,
        string? posterUrl,
        string plot)
    {
        Id = id;
        LegacyId = legacyId;
        TitleType = titleType;
        PrimaryTitle = primaryTitle;
        OriginalTitle = originalTitle;
        IsAdult = isAdult;
        StartYear = startYear;
        EndYear = endYear;
        RuntimeMinutes = runtimeMinutes;
        PosterUrl = posterUrl;
        Plot = plot;
    }
    
    // Is used everywhere else
    private Movie(
        string legacyId, 
        string titleType, 
        string primaryTitle,
        string? originalTitle,
        bool? isAdult,
        int? startYear,
        int? endYear,
        int? runtimeMinutes,
        string? posterUrl,
        string? plot)
    {
        Id = Guid.NewGuid();
        LegacyId = legacyId;
        TitleType = titleType.Trim();
        PrimaryTitle = primaryTitle.Trim();
        OriginalTitle = originalTitle?.Trim() ?? primaryTitle.Trim(); // Default to primaryTitle
        IsAdult = isAdult ?? false; // Default to false
        StartYear = startYear ?? DateTime.Now.Year; // Default to current year
        EndYear = endYear; // Can be null
        RuntimeMinutes = runtimeMinutes ?? 90; // Default to 90 minutes
        PosterUrl = posterUrl; // Can be null
        Plot = plot?.Trim() ?? "No plot available"; // Default plot
    }
    
    public static Movie Create(
        string titleType,
        string primaryTitle,
        string? originalTitle = null,
        bool? isAdult = null,
        int? startYear = null,
        int? endYear = null,
        int? runtimeMinutes = null,
        string? posterUrl = null,
        string? plot = null)
    {
        if (string.IsNullOrWhiteSpace(titleType))
            throw new ArgumentException("TitleType cannot be empty.", nameof(titleType));

        if (string.IsNullOrWhiteSpace(primaryTitle))
            throw new ArgumentException("PrimaryTitle cannot be empty.", nameof(primaryTitle));

        // Auto-generate LegacyId
        var legacyId = GenerateLegacyId();

        var movie = new Movie(
            legacyId,
            titleType.Trim(),
            primaryTitle.Trim(),
            originalTitle,
            isAdult,
            startYear,
            endYear,
            runtimeMinutes,
            posterUrl,
            plot);

        movie.AddDomainEvent(new MovieCreatedDomainEvent(movie.PrimaryTitle));

        return movie;
    }

    private static string GenerateLegacyId()
    {
        // Generate unique LegacyId: "tt" + timestamp + random
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var random = Random.Shared.Next(1000, 9999);
        return $"tt{timestamp}{random}";
    }
}
