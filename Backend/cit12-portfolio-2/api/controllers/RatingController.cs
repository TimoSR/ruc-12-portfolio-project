using application.accountService;
using application.ratingService;
using domain.account;
using domain.ratings;
using Microsoft.AspNetCore.Http;

namespace api.controllers;

using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/accounts/{accountId:guid}/ratings")]
[Produces(MediaTypeNames.Application.Json)]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingsController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(RatingCommandDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] RatingCommandDto commandDto, CancellationToken cancellationToken)
    {
        var result = await _ratingService.AddRatingAsync(commandDto, cancellationToken);

        if (result.IsSuccess)
        {
            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Value.Id },
                result.Value
            );
        }

        return result.Error switch
        {
            var e when e == AccountErrors.DuplicateEmail || e == AccountErrors.DuplicateUsername =>
                Conflict(new ProblemDetails
                {
                    Type = "https://httpstatuses.com/409",
                    Title = "Conflict",
                    Status = StatusCodes.Status409Conflict,
                    Detail = e.Description,
                    Instance = HttpContext.TraceIdentifier
                }),

            _ => StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Type = "https://httpstatuses.com/500",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = result.Error.Description,
                Instance = HttpContext.TraceIdentifier
            })
        };
    }
    
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(Rating), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _ratingService.GetRatingByIdAsync(id, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }
        
        return result.Error switch
        {
            var e when e == AccountErrors.NotFound =>
                NotFound(new ProblemDetails
                {
                    Type = "https://httpstatuses.com/404",
                    Title = "Not Found",
                    Detail = e.Description,
                    Status = StatusCodes.Status404NotFound,
                    Instance = HttpContext.TraceIdentifier
                }),

            _ => StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Type = "https://httpstatuses.com/500",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = result.Error.Description,
                Instance = HttpContext.TraceIdentifier
            })
        };
    }
}
