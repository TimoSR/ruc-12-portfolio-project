using System.Net.Mime;
using application.accountService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class AccountsController(IAccountService accountService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(AccountDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] CreateAccountCommand command, CancellationToken cancellationToken)
    {
        var result = await accountService.CreateAccountAsync(command, cancellationToken);

        if (result.IsSuccess)
        {
            var account = result.Value!;
        
            var dto = new AccountDto(account.Id, account.Email, account.Username);

            // Prefer CreatedAtAction or CreatedAtRoute if GetById is available
            return CreatedAtAction(
                nameof(GetById),
                new { id = dto.Id },
                dto
            );
        }

        return result.Error.Code switch
        {
            "Account.DuplicateEmail" or "Account.DuplicateUsername" =>
                Conflict(new ProblemDetails
                {
                    Type = "https://httpstatuses.com/409",
                    Title = "Conflict",
                    Status = StatusCodes.Status409Conflict,
                    Detail = result.Error.Description,
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
    [ProducesResponseType(typeof(AccountDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await accountService.GetAccountByIdAsync(id, cancellationToken);

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

        var account = result.Value!;
        var dto = new AccountDto(account.Id, account.Email, account.Username);

        return Ok(dto);
    }
}