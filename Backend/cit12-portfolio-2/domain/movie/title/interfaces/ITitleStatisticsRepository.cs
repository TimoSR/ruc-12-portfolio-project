namespace domain.movie.title.interfaces;

public interface ITitleStatisticsRepository
{
    Task<TitleStatistics?> GetByTitleIdAsync(Guid titleId, CancellationToken cancellationToken = default);
}
