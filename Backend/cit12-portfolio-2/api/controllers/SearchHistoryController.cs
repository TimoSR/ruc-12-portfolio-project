using application.searchHistoryService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.Mime;

namespace api.controllers;

[ApiController]
[Route("api/v{version:apiVersion}/accounts/{accountId:guid}/search-history")]
[Produces(MediaTypeNames.Application.Json)]
[ApiVersion("1.0")]
public class SearchHistoryController(ISearchHistoryService historyService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SearchHistoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHistory(Guid accountId, [FromQuery] int limit = 50, CancellationToken cancellationToken = default)
    {
        var result = await historyService.GetUserHistoryAsync(accountId, limit, cancellationToken);
        if (result.IsFailure) return BadRequest(result.Error);

        var dtos = result.Value.Select(h => new SearchHistoryDto(h.Id, h.Query, h.Timestamp));
        return Ok(dtos);
    }

    [HttpPost]
    [ProducesResponseType(typeof(SearchHistoryDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> AddSearch(Guid accountId, [FromBody] CreateSearchHistoryDto dto, CancellationToken cancellationToken)
    {
        var result = await historyService.AddSearchAsync(accountId, dto.Query, cancellationToken);
        if (result.IsFailure) return BadRequest(result.Error);

        var h = result.Value;
        var responseDto = new SearchHistoryDto(h.Id, h.Query, h.Timestamp);
        
        // No specific GetById for history, so just returning 201 with body
        return Created("", responseDto); 
    }
}
