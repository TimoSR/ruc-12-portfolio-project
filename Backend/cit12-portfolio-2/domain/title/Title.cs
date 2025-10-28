using domain.title.interfaces;
using service_patterns;

namespace domain.title;

public class Title : AggregateRoot, ITitle
{
    public Guid Id { get; private set; }
    public string LegacyId { get; private set; }
    public string TitleType { get; private set; }
    public string PrimaryTitle { get; private set; }
    public string OriginalTitle { get; private set; }
    public bool IsAdult { get; private set; }
    public int StartYear { get; private set; }
    public int? EndYear { get; private set; }
    public int? RuntimeMinutes { get; private set; }
    public string? PosterUrl { get; private set; }
    public string? Plot { get; private set; }

    // Is used for the database
    internal Title(
        Guid id, 
        string legacyId, 
        string titleType, 
        string primaryTitle,
        string originalTitle,
        bool isAdult,
        int startYear,
        int? endYear,
        int? runtimeMinutes,
        string? posterUrl,
        string? plot)
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
    private Title(
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
        RuntimeMinutes = runtimeMinutes; // Can be null
        PosterUrl = posterUrl; // Can be null
        Plot = plot?.Trim() ?? "No plot available"; // Default plot
    }
    
    public static Title Create(
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
            throw new InvalidTitleTypeException();

        if (string.IsNullOrWhiteSpace(primaryTitle))
            throw new InvalidPrimaryTitleException();

        // Auto-generate LegacyId
        var legacyId = GenerateLegacyId();

        var title = new Title(
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

        title.AddDomainEvent(new TitleCreatedDomainEvent(title.PrimaryTitle));

        return title;
    }

    private static string GenerateLegacyId()
    {
        // Generate unique LegacyId: "tt" + timestamp + random
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var random = Random.Shared.Next(1000, 9999);
        return $"tt{timestamp}{random}";
    }

    // Business methods for updating title properties
    public void UpdatePosterUrl(string? newPosterUrl)
    {
        if (PosterUrl == newPosterUrl)
            return;

        PosterUrl = newPosterUrl;
        AddDomainEvent(new TitleUpdatedDomainEvent(Id, PrimaryTitle));
    }

    public void UpdatePlot(string? newPlot)
    {
        // Allow null plot
        var trimmedPlot = newPlot?.Trim();
        
        if (Plot == trimmedPlot)
            return;

        Plot = trimmedPlot;
        AddDomainEvent(new TitleUpdatedDomainEvent(Id, PrimaryTitle));
    }

    public void UpdateRuntimeMinutes(int? runtimeMinutes)
    {
        if (runtimeMinutes.HasValue && runtimeMinutes <= 0)
            throw new ArgumentOutOfRangeException(nameof(runtimeMinutes), "Runtime must be positive.");

        if (RuntimeMinutes == runtimeMinutes)
            return;

        RuntimeMinutes = runtimeMinutes;
        AddDomainEvent(new TitleUpdatedDomainEvent(Id, PrimaryTitle));
    }

    public void ChangePrimaryTitle(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
            throw new InvalidPrimaryTitleException();
        
        newTitle = newTitle.Trim();
        if (PrimaryTitle == newTitle)
            return;
            
        PrimaryTitle = newTitle;
        AddDomainEvent(new TitleUpdatedDomainEvent(Id, PrimaryTitle));
    }

    public void ChangeOriginalTitle(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
            throw new ArgumentException("Original title cannot be empty.", nameof(newTitle));
        
        newTitle = newTitle.Trim();
        if (OriginalTitle == newTitle)
            return;
            
        OriginalTitle = newTitle;
        AddDomainEvent(new TitleUpdatedDomainEvent(Id, PrimaryTitle));
    }

    public void ChangeStartYear(int newYear)
    {
        if (newYear <= 0)
            throw new ArgumentOutOfRangeException(nameof(newYear), "Start year must be positive.");
        
        if (StartYear == newYear)
            return;
            
        StartYear = newYear;
        AddDomainEvent(new TitleUpdatedDomainEvent(Id, PrimaryTitle));
    }

    public void ChangeEndYear(int? newYear)
    {
        if (newYear.HasValue && newYear <= 0)
            throw new ArgumentOutOfRangeException(nameof(newYear), "End year must be positive.");
        
        if (EndYear == newYear)
            return;
            
        EndYear = newYear;
        AddDomainEvent(new TitleUpdatedDomainEvent(Id, PrimaryTitle));
    }
}
