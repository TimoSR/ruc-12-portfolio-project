using service_patterns;

namespace application.titleService;

public record TitleDto(
    Guid Id,
    string? LegacyId, // EPC: added LegacyId
    string TitleType,
    string PrimaryTitle, 
    string? OriginalTitle,
    bool IsAdult,
    int? StartYear,
    int? EndYear,
    int? RuntimeMinutes,
    string? PosterUrl,
    string? Plot,
    string? Url = null
) : IDTO;

public record TitleLegacyDto(
    Guid Id,
    string LegacyId, // EPC: added LegacyId  
    string TitleType,
    string PrimaryTitle, 
    string? OriginalTitle,
    bool IsAdult,
    int? StartYear,
    int? EndYear,
    int? RuntimeMinutes,
    string? PosterUrl,
    string? Plot,
    string? Url = null) : IDTO;


public record SearchTitlesQuery(
    string? Query, 
    int Page = 1, 
    int PageSize = 20
);

public record CreateTitleCommand(
    string TitleType,
    string PrimaryTitle,
    string? OriginalTitle = null,
    bool? IsAdult = null,
    int? StartYear = null,
    int? EndYear = null,
    int? RuntimeMinutes = null,
    string? PosterUrl = null,
    string? Plot = null
);

public record UpdateTitleCommand(
    string? PrimaryTitle = null,
    string? OriginalTitle = null,
    bool? IsAdult = null,
    int? StartYear = null,
    int? EndYear = null,
    int? RuntimeMinutes = null,
    string? PosterUrl = null,
    string? Plot = null
);

