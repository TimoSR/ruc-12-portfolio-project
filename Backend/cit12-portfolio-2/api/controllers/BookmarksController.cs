using application.bookmarkService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.Mime;

namespace api.controllers;

[ApiController]
[Route("api/v{version:apiVersion}/accounts/{accountId:guid}/bookmarks")]
[Produces(MediaTypeNames.Application.Json)]
[ApiVersion("1.0")]
public class BookmarksController(IBookmarkService bookmarkService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BookmarkDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBookmarks(Guid accountId, CancellationToken cancellationToken)
    {
        var result = await bookmarkService.GetUserBookmarksAsync(accountId, cancellationToken);
        if (result.IsFailure) return BadRequest(result.Error);

        var dtos = result.Value.Select(b => new BookmarkDto(b.Id, b.TargetId, b.TargetType, b.Note, b.CreatedAt));
        return Ok(dtos);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BookmarkDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> AddBookmark(Guid accountId, [FromBody] CreateBookmarkDto dto, CancellationToken cancellationToken)
    {
        var result = await bookmarkService.AddBookmarkAsync(accountId, dto.TargetId, dto.TargetType, dto.Note, cancellationToken);
        if (result.IsFailure) return BadRequest(result.Error);

        var b = result.Value;
        return CreatedAtAction(nameof(GetBookmarks), new { accountId }, new BookmarkDto(b.Id, b.TargetId, b.TargetType, b.Note, b.CreatedAt));
    }

    [HttpDelete("{targetId}")] // Deleting by targetId (tconst/nconst) because ID is internal
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RemoveBookmark(Guid accountId, string targetId, [FromQuery] string targetType, CancellationToken cancellationToken)
    {
        // Validating targetType is required
        if (string.IsNullOrEmpty(targetType)) return BadRequest("TargetType is required");

        var result = await bookmarkService.RemoveBookmarkAsync(accountId, targetId, targetType, cancellationToken);
        if (result.IsFailure) return NotFound(result.Error);

        return NoContent();
    }
}
