using application.ratingService;

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

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid accountId, CancellationToken cancellationToken)
    {
        var ratings = await _ratingService.GetByAccountIdAsync(accountId, cancellationToken);
        return Ok(ratings);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid accountId, [FromBody] CreateRatingDto dto, CancellationToken cancellationToken)
    {
        var rating = await _ratingService.CreateAsync(accountId, dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { accountId, ratingId = rating.Id }, rating);
    }

    [HttpGet("{ratingId:guid}")]
    public async Task<IActionResult> GetById(Guid accountId, Guid ratingId, CancellationToken cancellationToken)
    {
        var rating = await _ratingService.GetByIdAsync(accountId, ratingId, cancellationToken);
        if (rating == null)
            return NotFound();

        return Ok(rating);
    }

    [HttpPut("{ratingId:guid}")]
    public async Task<IActionResult> Replace(Guid accountId, Guid ratingId, [FromBody] UpdateRatingDto dto, CancellationToken cancellationToken)
    {
        var updated = await _ratingService.ReplaceAsync(accountId, ratingId, dto, cancellationToken);
        return Ok(updated);
    }

    [HttpPatch("{ratingId:guid}")]
    public async Task<IActionResult> UpdatePartial(Guid accountId, Guid ratingId, [FromBody] JsonPatchDocument<UpdateRatingDto> patch, CancellationToken cancellationToken)
    {
        var updated = await _ratingService.UpdatePartialAsync(accountId, ratingId, patch, cancellationToken);
        return Ok(updated);
    }

    [HttpDelete("{ratingId:guid}")]
    public async Task<IActionResult> Delete(Guid accountId, Guid ratingId, CancellationToken cancellationToken)
    {
        await _ratingService.DeleteAsync(accountId, ratingId, cancellationToken);
        return NoContent();
    }
}
