# HATEOAS and Pagination Infrastructure

This document describes the shared infrastructure for implementing HATEOAS (Hypermedia as the Engine of Application State) self-references and pagination in the API according to requirements 2-C.5 and 2-C.6.

## Overview

The infrastructure consists of:
- **DTOs**: `LinkDto`, `PagedResult<T>` for responses
- **Helpers**: URL generation utilities
- **Extensions**: `ToPagedResult()` for easy pagination setup
- **Validation**: `PaginationQuery` with default (20) and max (100) page sizes

## Components

### 1. LinkDto

Simple record representing a HATEOAS link with `Href`, `Rel`, and optional `Method`.

```csharp
public record LinkDto(
    string Href,
    string Rel,
    string Method = "GET"
);
```

### 2. PagedResult<T>

Wrapper class for paginated responses containing:
- `Items`: The collection of items
- `Page`, `PageSize`: Current page info
- `TotalItems`, `TotalPages`: Metadata
- `Links`: Dictionary of navigation links (self, first, prev, next, last)

### 3. PaginationQuery

Base record for pagination parameters with validation:
- Default page size: 20
- Maximum page size: 100
- Computed properties: `Skip`, `Take` for database queries

### 4. ControllerExtensions.ToPagedResult()

Extension method that creates a fully populated `PagedResult<T>` with navigation links.

## Usage Examples

### Single Resource with Self-Reference

Add a `Url` property to your DTO and populate it in the controller:

**DTO:**
```csharp
public record PersonDto(
    Guid Id,
    string PrimaryName,
    string? Url = null  // Add Url property
);
```

**Controller:**
```csharp
[HttpGet("{id:guid}", Name = "GetPersonById")]
public async Task<IActionResult> GetById(Guid id)
{
    var result = await service.GetPersonByIdAsync(id);
    if (!result.IsSuccess) return NotFound(result.Error);
    
    // Add self-reference URL
    var dto = result.Value with 
    { 
        Url = Url.ActionLink("GetPersonById", values: new { id, version = "1.0" })
    };
    return Ok(dto);
}
```

### Paginated Collection Response

Use the `ToPagedResult()` extension method:

**Controller:**
```csharp
[HttpGet("search", Name = "SearchPersons")]
public async Task<IActionResult> Search(
    [FromQuery] string query, 
    [FromQuery] int page = 1, 
    [FromQuery] int pageSize = 20)
{
    var result = await service.SearchPersonsAsync(new SearchPersonsQuery(query, page, pageSize));
    if (!result.IsSuccess) return BadRequest(result.Error);
    
    // Convert to paginated result with links
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
```

**Service (return tuple):**
```csharp
public async Task<Result<(IEnumerable<PersonDto> items, int totalCount)>> SearchPersonsAsync(...)
{
    var (items, totalCount) = await repository.SearchByNameAsync(query, page, pageSize);
    return Result<(IEnumerable<PersonDto>, int)>.Success((items, totalCount));
}
```

**Repository (return tuple):**
```csharp
public async Task<(IEnumerable<Person> items, int totalCount)> SearchByNameAsync(...)
{
    var queryable = _dbContext.Persons.Where(...);
    var totalCount = await queryable.CountAsync();
    var items = await queryable.Skip(skip).Take(pageSize).ToListAsync();
    return (items, totalCount);
}
```

## Response Examples

### Single Resource with Self-Reference

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "primaryName": "John Doe",
  "url": "http://localhost:5000/api/v1/persons/550e8400-e29b-41d4-a716-446655440000"
}
```

### Paginated Collection

```json
{
  "items": [
    { "id": "...", "name": "Person 1", "url": "..." },
    { "id": "...", "name": "Person 2", "url": "..." }
  ],
  "page": 1,
  "pageSize": 20,
  "totalItems": 150,
  "totalPages": 8,
  "links": {
    "self": { "href": "/api/v1/persons/search?query=john&page=1&pageSize=20", "rel": "self" },
    "first": { "href": "/api/v1/persons/search?query=john&page=1&pageSize=20", "rel": "first" },
    "next": { "href": "/api/v1/persons/search?query=john&page=2&pageSize=20", "rel": "next" },
    "last": { "href": "/api/v1/persons/search?query=john&page=8&pageSize=20", "rel": "last" }
  }
}
```

## Implementation Status

### Completed (PersonsController)
- ✅ Search endpoint with pagination
- ✅ GetById with self-reference
- ✅ GetByLegacyId with self-reference
- ✅ Create with self-reference

### Completed (TitlesController)
- ✅ Search endpoint with pagination
- ✅ GetById with self-reference
- ✅ GetByLegacyId with self-reference
- ✅ Create with self-reference
- ✅ Update with self-reference

### Pending (Other Controllers)
AccountsController and RatingsController will be updated by Timo using the same patterns described in this documentation.

## Notes

- All listing operations must return `PagedResult<T>` wrappers
- All individual resource responses must include self-reference URLs
- Default page size is 20, maximum is 100
- Navigation links (prev, next, first, last) are only included when applicable

