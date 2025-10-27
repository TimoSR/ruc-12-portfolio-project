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
}
