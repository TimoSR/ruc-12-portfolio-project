namespace domain.movie.title;

public class TitleStatistics
{
    public Guid TitleId { get; private set; }
    public double AverageRating { get; private set; }
    public int NumVotes { get; private set; }

    private TitleStatistics() { }
}
