using application.personService;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/persons")]
public sealed class PersonsController(IPersonService service) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePersonCommandDto command, CancellationToken cancellationToken)
    {
        var result = await service.CreatePersonAsync(command, cancellationToken);
        if (!result.IsSuccess) return BadRequest(result.Error);
        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id, version = "1.0" }, result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await service.GetPersonByIdAsync(id, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    [HttpGet("by-legacy/{legacyId}")]
    public async Task<IActionResult> GetByLegacyId(string legacyId, CancellationToken cancellationToken)
    {
        var result = await service.GetPersonByLegacyIdAsync(legacyId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var result = await service.SearchPersonsAsync(new SearchPersonsQuery(query, page, pageSize), cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpGet("{name}/words")]
    public async Task<IActionResult> Words(string name, [FromQuery] int limit = 10, CancellationToken cancellationToken = default)
    {
        var result = await service.GetPersonWordsAsync(name, limit, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpGet("{name}/co-actors")]
    public async Task<IActionResult> CoActors(string name, CancellationToken cancellationToken = default)
    {
        var result = await service.GetCoActorsAsync(name, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpGet("{name}/popular-co-actors")]
    public async Task<IActionResult> PopularCoActors(string name, CancellationToken cancellationToken = default)
    {
        var result = await service.GetPopularCoActorsAsync(name, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpGet("{id:guid}/known-for")]
    public async Task<IActionResult> KnownFor(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await service.GetKnownForTitlesAsync(id, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpGet("{id:guid}/professions")]
    public async Task<IActionResult> Professions(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await service.GetProfessionsAsync(id, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }
}


