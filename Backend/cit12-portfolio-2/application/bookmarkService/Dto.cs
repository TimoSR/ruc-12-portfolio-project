using System;
using application.services;
using service_patterns;

namespace application.bookmarkService;

public record BookmarkDto(
    Guid AccountId,
    Guid? TitleId,
    Guid? PersonId,
    string? Notes,
    DateTime CreatedAt,
    bool IsDeleted = false
) : IDTO;

public record CreateBookmarkDto(
    Guid? TitleId,
    Guid? PersonId,
    string? Notes
);
