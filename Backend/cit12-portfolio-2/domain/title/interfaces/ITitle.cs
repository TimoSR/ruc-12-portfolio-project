using service_patterns;

namespace domain.title.interfaces;

public interface ITitle : IAggregateRoot
{
    Guid Id { get; }
    string LegacyId { get; }
    string TitleType { get; }
    string PrimaryTitle { get; }
    string OriginalTitle { get; }
    bool IsAdult { get; }
    int? StartYear { get; }
    int? EndYear { get; }
    int? RuntimeMinutes { get; }
    string? PosterUrl { get; }
    string? Plot { get; }

    static abstract Title Create(
        string titleType,
        string primaryTitle,
        string? originalTitle,
        bool? isAdult,
        int? startYear,
        int? endYear,
        int? runtimeMinutes,
        string? posterUrl,
        string? plot);

    void UpdatePosterUrl(string? newPosterUrl);
    void UpdatePlot(string? newPlot);
    void UpdateRuntimeMinutes(int? runtimeMinutes);
    void ChangePrimaryTitle(string newTitle);
    void ChangeOriginalTitle(string newTitle);
    void ChangeStartYear(int newYear);
    void ChangeEndYear(int? newYear);
}
