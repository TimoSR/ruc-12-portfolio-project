using api.helpers;
using api.models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace api.extensions;

public static class ControllerExtensions
{
    public static PagedResult<T> ToPagedResult<T>(
        this IEnumerable<T> items,
        int totalCount,
        int page,
        int pageSize,
        HttpContext httpContext,
        string actionName,
        object? routeValues = null)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        
        var result = new PagedResult<T>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalCount,
            TotalPages = totalPages,
            Links = new Dictionary<string, LinkDto>()
        };
        
        var urlHelper = httpContext.RequestServices
            .GetRequiredService<IUrlHelperFactory>()
            .GetUrlHelper(new ActionContext(httpContext, httpContext.GetRouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()));
        
        // Generate all pagination links
        result.Links["self"] = new LinkDto(
            urlHelper.GeneratePaginatedUrl(httpContext, actionName, page, pageSize, routeValues) ?? "",
            "self"
        );
        
        if (page > 1)
        {
            result.Links["first"] = new LinkDto(
                urlHelper.GeneratePaginatedUrl(httpContext, actionName, 1, pageSize, routeValues) ?? "",
                "first"
            );
            
            result.Links["prev"] = new LinkDto(
                urlHelper.GeneratePaginatedUrl(httpContext, actionName, page - 1, pageSize, routeValues) ?? "",
                "prev"
            );
        }
        
        if (page < totalPages)
        {
            result.Links["next"] = new LinkDto(
                urlHelper.GeneratePaginatedUrl(httpContext, actionName, page + 1, pageSize, routeValues) ?? "",
                "next"
            );
            
            result.Links["last"] = new LinkDto(
                urlHelper.GeneratePaginatedUrl(httpContext, actionName, totalPages, pageSize, routeValues) ?? "",
                "last"
            );
        }
        
        return result;
    }
}

