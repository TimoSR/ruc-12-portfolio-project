namespace api.models;

public record LinkDto(
    string Href,
    string Rel,
    string Method = "GET"
);

