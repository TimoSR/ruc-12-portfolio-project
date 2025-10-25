using domain.movie.interfaces;
using service_patterns;

namespace domain.movie;

public class Movie : AggregateRoot, IMovie
{
    public Guid Id { get; private set; }
    public string? LegacyId { get; private set; }
    public string TitleType { get; private set; }
    public string PrimaryTitle { get; private set; }
    public string? OriginalTitle { get; private set; }
    public bool IsAdult { get; private set; }
    public int? StartYear { get; private set; }
    public int? EndYear { get; private set; }
    public int? RuntimeMinutes { get; private set; }
    public string? PosterUrl { get; private set; }
    public string? Plot { get; private set; }

<<<<<<< HEAD
    // Internal constructor for EF Core reconstruction
    internal Movie(Guid id, string legacyId, string titleType, string primaryTitle, 
        string? originalTitle, bool isAdult, int? startYear, int? endYear, 
        int? runtimeMinutes, string? posterUrl, string? plot)
=======
    // Is used for the database
    internal Movie(
        Guid id, 
        string legacyId, 
        string titleType, 
        string primaryTitle, 
        string? originalTitle, 
        bool isAdult, 
        int? startYear, 
        int? endYear, 
        int? runtimeMinutes, 
        string? posterUrl, 
        string? plot)
>>>>>>> ce288ad93558dc1c94289ad180041626c1f27b7a
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
    
<<<<<<< HEAD
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
=======
    // Is used everywhere else
    private Movie(
        string titleType, 
        string primaryTitle,
        string? originalTitle = null,
        bool isAdult = false,
        int? startYear = null,
        int? endYear = null,
        int? runtimeMinutes = null,
        string? posterUrl = null,
        string? plot = null)
    {
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
    
    public static Movie Create(
        string titleType = "movie",
        string primaryTitle = "Untitled",
        string? originalTitle = null,
        bool isAdult = false,
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

        if (startYear.HasValue && endYear.HasValue && endYear < startYear)
            throw new ArgumentException("EndYear cannot be before StartYear.");

        if (runtimeMinutes is <= 0)
            throw new ArgumentException("RuntimeMinutes must be positive.", nameof(runtimeMinutes));

        var movie = new Movie(
            titleType.Trim(),
            primaryTitle.Trim(),
            originalTitle?.Trim(),
            isAdult,
            startYear,
            endYear,
            runtimeMinutes,
            posterUrl?.Trim(),
            plot?.Trim());

        movie.AddDomainEvent(new MovieCreatedDomainEvent(movie.PrimaryTitle));

        return movie;
>>>>>>> ce288ad93558dc1c94289ad180041626c1f27b7a
    }
}
