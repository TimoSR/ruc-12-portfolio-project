using System.Net.Mime;
using application.movieService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class MovieController(IMovieService movieService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(MovieDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await movieService.GetMovieByIdAsync(id, cancellationToken);

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
    [ProducesResponseType(typeof(MovieLegacyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByLegacyId(string legacyId, CancellationToken cancellationToken)
    {
        var result = await movieService.GetMovieByLegacyIdAsync(legacyId, cancellationToken);

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
    [ProducesResponseType(typeof(IEnumerable<MovieDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Search([FromQuery] SearchMoviesQuery query, CancellationToken cancellationToken)
    {
        var result = await movieService.SearchMoviesAsync(query, cancellationToken);

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
}
