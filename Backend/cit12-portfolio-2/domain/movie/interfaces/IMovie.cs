using service_patterns;

namespace domain.movie.interfaces;

public interface IMovie : IAggregateRoot
{
    Guid Id { get; }
    string LegacyId { get; }
    string TitleType { get; }
    string PrimaryTitle { get; }
    string? OriginalTitle { get; }
    bool IsAdult { get; }
    int? StartYear { get; }
    int? EndYear { get; }
    int? RuntimeMinutes { get; }
    string? PosterUrl { get; }
    string? Plot { get; }
}
