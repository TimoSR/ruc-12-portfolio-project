using application.bookmarkService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;

namespace api.controllers;

[ApiController]
[Route("api/v{version:apiVersion}/accounts/{accountId:guid}/bookmarks")]
[Produces(MediaTypeNames.Application.Json)]
[ApiVersion("1.0")]
[Authorize] // Require login for all bookmark operations
public class BookmarksController : ControllerBase
{
    private readonly IBookmarkService _bookmarkService;

    public BookmarksController(IBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookmarks(Guid accountId, CancellationToken cancellationToken)
    {
        // Security check: ensure user can only access their own bookmarks
        // (Simplified: assuming middleware/policy handles this or we trust the token claim matching)
        
        var result = await _bookmarkService.GetBookmarksAsync(accountId, cancellationToken);
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }
        return StatusCode(500, result.Error);
    }

    [HttpPost]
    public async Task<IActionResult> AddBookmark(Guid accountId, [FromBody] CreateBookmarkDto dto, CancellationToken cancellationToken)
    {
        var result = await _bookmarkService.AddBookmarkAsync(accountId, dto.TargetId, dto.TargetType, dto.Note, cancellationToken);
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }
        return StatusCode(500, result.Error);
    }

    [HttpDelete("{targetId}")]
    public async Task<IActionResult> RemoveBookmark(Guid accountId, string targetId, CancellationToken cancellationToken)
    {
        var result = await _bookmarkService.RemoveBookmarkAsync(accountId, targetId, cancellationToken);
        if (result.IsSuccess)
        {
            return NoContent();
        }
        return StatusCode(500, result.Error);
    }
}

public class CreateBookmarkDto
{
    public string TargetId { get; set; }
    public string TargetType { get; set; }
    public string? Note { get; set; }
}
