using service_patterns;

namespace domain.title;

public static class TitleErrors
{
    public static readonly Error NotFound = new("Title.NotFound", "Title not found.");
}
