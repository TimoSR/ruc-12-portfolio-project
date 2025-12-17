using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;
using application.bookmarkService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers;

[ApiController]
[Route("api/v{version:apiVersion}/accounts/{accountId:guid}/bookmarks")]
[Produces(MediaTypeNames.Application.Json)]
[ApiVersion("1.0")]
public class BookmarkController : ControllerBase
{
    private readonly IBookmarkService _bookmarkService;

    public BookmarkController(IBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BookmarkDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBookmarks([FromRoute] Guid accountId, CancellationToken cancellationToken)
    {
        var result = await _bookmarkService.GetBookmarksAsync(accountId, cancellationToken);
        return Ok(result.Value);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BookmarkDto), StatusCodes.Status200OK)] // Returns object if created
    [ProducesResponseType(StatusCodes.Status204NoContent)] // Returns 204 if removed
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ToggleBookmark([FromRoute] Guid accountId, [FromBody] CreateBookmarkDto dto, CancellationToken cancellationToken)
    {
        var result = await _bookmarkService.ToggleBookmarkAsync(accountId, dto, cancellationToken);

        if (result.IsSuccess)
        {
            if (result.Value.IsDeleted)
            {
                return NoContent(); // Removed
            }
            return Ok(result.Value); // Created
        }

        return BadRequest(new ProblemDetails
        {
            Title = "Bad Request",
            Detail = result.Error.Description,
            Status = StatusCodes.Status400BadRequest
        });
    }

    [HttpGet("check")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public async Task<IActionResult> IsBookmarked([FromRoute] Guid accountId, [FromQuery] Guid? titleId, [FromQuery] Guid? personId, CancellationToken cancellationToken)
    {
        var result = await _bookmarkService.IsBookmarkedAsync(accountId, titleId, personId, cancellationToken);
        return Ok(result.Value);
    }
}
