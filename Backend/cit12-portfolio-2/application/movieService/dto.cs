using service_patterns;

namespace application.movieService;

public record MovieDto(
    Guid Id,
    string TitleType,
    string PrimaryTitle, 
    string? OriginalTitle,
    bool IsAdult,
    int? StartYear,
    int? EndYear,
    int? RuntimeMinutes,
    string? PosterUrl,
    string? Plot
) : IDTO;

public record MovieLegacyDto(
    Guid Id,
    string LegacyId,  
    string TitleType,
    string PrimaryTitle, 
    string? OriginalTitle,
    bool IsAdult,
    int? StartYear,
    int? EndYear,
    int? RuntimeMinutes,
    string? PosterUrl,
    string? Plot) : IDTO;


public record SearchMoviesQuery(
    string? Query, 
    int Page = 1, 
    int PageSize = 20
);
