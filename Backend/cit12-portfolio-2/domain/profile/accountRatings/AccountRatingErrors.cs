using service_patterns;

namespace domain.profile.accountRatings;

public static class AccountRatingErrors
{
    public static readonly Error DuplicateRating = new("Rating.Duplicate", "Title already rated.");
    public static readonly Error NotFound = new("Rating.NotFound", "Rating does not exist.");
}