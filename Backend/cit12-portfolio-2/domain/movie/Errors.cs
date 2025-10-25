using service_patterns;

namespace domain.movie;

public static class MovieErrors
{
    public static readonly Error NotFound = new("Movie.NotFound", "Movie not found.");
}
