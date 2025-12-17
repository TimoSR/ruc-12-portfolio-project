using System;

namespace domain.profile.bookmark;

public class Bookmark
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid? TitleId { get; set; }
    public Guid? PersonId { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
