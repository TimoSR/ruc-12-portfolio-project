using api.extensions;
using api.models;
using application.titleService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;


namespace api.controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[ApiVersion("1.0")]
public class TitlesController(ITitleService titleService) : ControllerBase
{
    [HttpGet("{titleId:guid}", Name = "GetTitleById")]
    [ProducesResponseType(typeof(TitleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(Guid titleId, CancellationToken cancellationToken)
    {
        var result = await titleService.GetTitleByIdAsync(titleId, cancellationToken);

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

        var dto = result.Value with 
        { 
            Url = Url.ActionLink("GetTitleById", values: new { titleId, version = "1.0" })
        };
        return Ok(dto);
    }

    [HttpGet("{legacyId}", Name = "GetTitleByLegacyId")]
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

        var dto = result.Value with 
        { 
            Url = Url.ActionLink("GetTitleByLegacyId", values: new { legacyId, version = "1.0" })
        };
        return Ok(dto);
    }

    [HttpGet(Name = "SearchTitles")]
    [ProducesResponseType(typeof(PagedResult<TitleDto>), StatusCodes.Status200OK)]
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

        var pagedResult = result.Value.items.ToPagedResult(
            result.Value.totalCount,
            page,
            pageSize,
            HttpContext,
            "SearchTitles",
            new { query }
        );

        return Ok(pagedResult);
    }

    [HttpGet("structured-search", Name = "StructuredSearchTitles")]
    [ProducesResponseType(typeof(PagedResult<TitleDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> StructuredSearch(
        [FromQuery] string? title = null,
        [FromQuery] string? plot = null,
        [FromQuery] string? character = null,
        [FromQuery] string? name = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await titleService.StructuredSearchAsync(title, plot, character, name, page, pageSize, cancellationToken);

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

        var pagedResult = result.Value.items.ToPagedResult(
            result.Value.totalCount,
            page,
            pageSize,
            HttpContext,
            "StructuredSearchTitles",
            new { title, plot, character, name }
        );

        return Ok(pagedResult);
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

        var dto = result.Value with 
        { 
            Url = Url.ActionLink("GetTitleById", values: new { titleId = result.Value.Id, version = "1.0" })
        };

        return CreatedAtAction(
            nameof(GetById),
            new { titleId = dto.Id },
            dto
        );
    }

    [HttpPut("{titleId:guid}")]
    [ProducesResponseType(typeof(TitleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update(Guid titleId, [FromBody] UpdateTitleCommand command, CancellationToken cancellationToken)
    {
        var result = await titleService.UpdateTitleAsync(titleId, command, cancellationToken);

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

        var dto = result.Value with 
        { 
            Url = Url.ActionLink("GetTitleById", values: new { titleId, version = "1.0" })
        };
        return Ok(dto);
    }

    [HttpDelete("{titleId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(Guid titleId, CancellationToken cancellationToken)
    {
        var result = await titleService.DeleteTitleAsync(titleId, cancellationToken);

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

    /// <summary>
    /// Gets similar movies based on genre similarity (Jaccard index)
    /// </summary>
    [HttpGet("{titleId:guid}/similar")]
    [ProducesResponseType(typeof(IEnumerable<SimilarMovieDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSimilarMovies(Guid titleId, [FromQuery] int limit = 10, CancellationToken cancellationToken = default)
    {
        var result = await titleService.GetSimilarMoviesAsync(titleId, limit, cancellationToken);

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
