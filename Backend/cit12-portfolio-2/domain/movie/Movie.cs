using domain.movie.interfaces;
using service_patterns;

namespace domain.movie;

public class Movie : AggregateRoot, IMovie
{
    public Guid Id { get; private set; }
    public string LegacyId { get; private set; }
    public string TitleType { get; private set; }
    public string PrimaryTitle { get; private set; }
    public string? OriginalTitle { get; private set; }
    public bool IsAdult { get; private set; }
    public int? StartYear { get; private set; }
    public int? EndYear { get; private set; }
    public int? RuntimeMinutes { get; private set; }
    public string? PosterUrl { get; private set; }
    public string? Plot { get; private set; }

    // Internal constructor for EF Core reconstruction
    internal Movie(Guid id, string legacyId, string titleType, string primaryTitle, 
        string? originalTitle, bool isAdult, int? startYear, int? endYear, 
        int? runtimeMinutes, string? posterUrl, string? plot)
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
    
    // Public factory method for tests and business logic
    public static Movie Create(Guid id, string legacyId, string titleType, string primaryTitle, 
        string? originalTitle, bool isAdult, int? startYear, int? endYear, 
        int? runtimeMinutes, string? posterUrl, string? plot)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(legacyId))
            throw new InvalidLegacyIdException();
        if (string.IsNullOrWhiteSpace(primaryTitle))
            throw new InvalidPrimaryTitleException();
        if (string.IsNullOrWhiteSpace(titleType))
            throw new InvalidTitleTypeException();
            
        return new Movie(id, legacyId, titleType, primaryTitle, originalTitle, 
            isAdult, startYear, endYear, runtimeMinutes, posterUrl, plot);
    }
}
