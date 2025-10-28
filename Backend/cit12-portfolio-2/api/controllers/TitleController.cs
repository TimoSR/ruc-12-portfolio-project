using System.Net.Mime;
using application.titleService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class TitleController(ITitleService titleService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TitleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await titleService.GetTitleByIdAsync(id, cancellationToken);

        if (!result.IsSuccess)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Not Found",
                Detail = result.Error.Description,
                Status = StatusCodes.Status404NotFound,
                Instance = HttpContext.TraceIdentifier
            });
        }

        return Ok(result.Value);
    }

    [HttpGet("legacy/{legacyId}")]
    [ProducesResponseType(typeof(TitleLegacyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByLegacyId(string legacyId, CancellationToken cancellationToken)
    {
        var result = await titleService.GetTitleByLegacyIdAsync(legacyId, cancellationToken);

        if (!result.IsSuccess)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Not Found",
                Detail = result.Error.Description,
                Status = StatusCodes.Status404NotFound,
                Instance = HttpContext.TraceIdentifier
            });
        }

        return Ok(result.Value);
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<TitleDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Search(
        [FromQuery] string? query = null, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20, 
        CancellationToken cancellationToken = default)
    {
        var searchQuery = new SearchTitlesQuery(query, page, pageSize);
        var result = await titleService.SearchTitlesAsync(searchQuery, cancellationToken);

        if (!result.IsSuccess)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Type = "https://httpstatuses.com/500",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = result.Error.Description,
                Instance = HttpContext.TraceIdentifier
            });
        }

        return Ok(result.Value);
    }

    [HttpPost]
    [ProducesResponseType(typeof(TitleDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] CreateTitleCommand command, CancellationToken cancellationToken)
    {
        var result = await titleService.CreateTitleAsync(command, cancellationToken);

        if (!result.IsSuccess)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Type = "https://httpstatuses.com/500",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = result.Error.Description,
                Instance = HttpContext.TraceIdentifier
            });
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Value!.Id },
            result.Value
        );
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TitleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTitleCommand command, CancellationToken cancellationToken)
    {
        var result = await titleService.UpdateTitleAsync(id, command, cancellationToken);

        if (!result.IsSuccess)
        {
            if (result.Error.Code == "Title.NotFound")
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Not Found",
                    Detail = result.Error.Description,
                    Status = StatusCodes.Status404NotFound,
                    Instance = HttpContext.TraceIdentifier
                });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Type = "https://httpstatuses.com/500",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = result.Error.Description,
                Instance = HttpContext.TraceIdentifier
            });
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await titleService.DeleteTitleAsync(id, cancellationToken);

        if (!result.IsSuccess)
        {
            if (result.Error.Code == "Title.NotFound")
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Not Found",
                    Detail = result.Error.Description,
                    Status = StatusCodes.Status404NotFound,
                    Instance = HttpContext.TraceIdentifier
                });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Type = "https://httpstatuses.com/500",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = result.Error.Description,
                Instance = HttpContext.TraceIdentifier
            });
        }

        return NoContent();
    }

}
