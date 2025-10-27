using service_patterns;

namespace domain.ratings;

public static class RatingErrors
{
    public static readonly Error DuplicateRating = new("Rating.Duplicate", "Title already rated.");
    public static readonly Error NotFound = new("Rating.NotFound", "Rating does not exist.");
}