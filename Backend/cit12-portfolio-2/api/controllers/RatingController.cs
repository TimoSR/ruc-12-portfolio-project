using application.ratingService;
using domain.profile.account;
using domain.profile.accountRatings;
using Microsoft.AspNetCore.Http;

namespace api.controllers;

using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v{version:apiVersion}/accounts/{accountId:guid}/ratings")]
[Produces(MediaTypeNames.Application.Json)]
[ApiVersion("1.0")]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingsController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(RatingDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromRoute] Guid accountId, [FromBody] RatingCommandDto commandDto, CancellationToken cancellationToken)
    {
        var result = await _ratingService.AddRatingAsync(accountId, commandDto, cancellationToken);

        if (result.IsSuccess)
        {
            return CreatedAtAction(
                nameof(GetById),
                new { accountId, ratingId = result.Value.Id },
                result.Value
            );
        }

        return result.Error switch
        {
            var e when e == AccountErrors.DuplicateEmail 
                    || e == AccountErrors.DuplicateUsername
                    || e == AccountRatingErrors.DuplicateRating =>
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
    
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<RatingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRatings(Guid accountId, CancellationToken cancellationToken)
    {
        var result = await _ratingService.GetRatingsAsync(accountId, cancellationToken);
        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }
        return BadRequest(result.Error);
    }

    [HttpGet("{ratingId:guid}")]
    [ProducesResponseType(typeof(RatingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid ratingId, CancellationToken cancellationToken)
    {
        var result = await _ratingService.GetRatingByIdAsync(ratingId, cancellationToken);

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

    [HttpGet("title/{titleId}")]
    [ProducesResponseType(typeof(RatingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> GetRatingForTitle(Guid accountId, string titleId, CancellationToken cancellationToken)
    {
        var result = await _ratingService.GetRatingForTitleAsync(accountId, titleId, cancellationToken);

        if (result.IsSuccess && result.Value is not null)
        {
            return Ok(result.Value);
        }

        // No rating found for this title
        return NoContent();
    }
}
