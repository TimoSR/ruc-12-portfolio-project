namespace application.movieService;

public record MovieDto(
    Guid Id, 
    string LegacyId,  // tconst for TMDB
    string TitleType,
    string PrimaryTitle, 
    string? OriginalTitle,
    bool IsAdult,
    int? StartYear,
    int? EndYear,
    int? RuntimeMinutes,
    string? PosterUrl,
    string? Plot
);

public record SearchMoviesQuery(
    string? Query, 
    int Page = 1, 
    int PageSize = 20
);
