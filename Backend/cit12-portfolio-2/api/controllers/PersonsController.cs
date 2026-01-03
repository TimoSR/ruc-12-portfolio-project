using api.extensions;
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
        
        var dto = result.Value with 
        { 
            Url = Url.ActionLink(nameof(GetById), values: new { id = result.Value.Id, version = "1.0" })
        };
        return CreatedAtAction(nameof(GetById), new { id = dto.Id, version = "1.0" }, dto);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(id, out var guid))
        {
            var result = await service.GetPersonByIdAsync(guid, cancellationToken);
            if (!result.IsSuccess) return NotFound(result.Error);
            
            var dto = result.Value with 
            { 
                Url = Url.ActionLink(nameof(GetById), values: new { id = guid, version = "1.0" })
            };
            return Ok(dto);
        }
        else
        {
            var result = await service.GetPersonByLegacyIdAsync(id, cancellationToken);
            if (!result.IsSuccess) return NotFound(result.Error);
            
            var dto = result.Value with 
            { 
                Url = Url.ActionLink(nameof(GetById), values: new { id = result.Value.Id, version = "1.0" })
            };
            return Ok(dto);
        }
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string? query = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
    {

        var searchQuery = new SearchPersonsQuery(query, page, pageSize);

        var result = await service.SearchPersonsAsync(searchQuery, cancellationToken);

        if (!result.IsSuccess) return BadRequest(result.Error);
        
        var pagedResult = result.Value.items.ToPagedResult(
            result.Value.totalCount,
            page,
            pageSize,
            HttpContext,
            "SearchPersons",
            new { query }
        );
        
        return Ok(pagedResult);
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

    [HttpGet("{id}/known-for")]
    public async Task<IActionResult> KnownFor(string id, CancellationToken cancellationToken = default)
    {
        Guid personId;
        if (Guid.TryParse(id, out var g))
        {
            personId = g;
        }
        else
        {
            var pResult = await service.GetPersonByLegacyIdAsync(id, cancellationToken);
            if (!pResult.IsSuccess) return NotFound(pResult.Error);
            personId = pResult.Value.Id;
        }

        var result = await service.GetKnownForTitlesAsync(personId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpGet("{id}/professions")]
    public async Task<IActionResult> Professions(string id, CancellationToken cancellationToken = default)
    {
        Guid personId;
        if (Guid.TryParse(id, out var g))
        {
            personId = g;
        }
        else
        {
            var pResult = await service.GetPersonByLegacyIdAsync(id, cancellationToken);
            if (!pResult.IsSuccess) return NotFound(pResult.Error);
            personId = pResult.Value.Id;
        }

        var result = await service.GetProfessionsAsync(personId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }
}


