using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.helpers;

public static class UrlHelper
{
    public static string? GenerateSelfReferenceUrl(
        this IUrlHelper urlHelper,
        string routeName,
        object? values = null)
    {
        return urlHelper.Link(routeName, values);
    }
    
    public static string? GeneratePaginatedUrl(
        this IUrlHelper urlHelper,
        HttpContext httpContext,
        string actionName,
        int page,
        int pageSize,
        object? additionalParams = null)
    {
        var request = httpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
        
        // Build URL using the current request path
        var currentPath = request.Path.Value ?? "";
        
        var queryParams = new Dictionary<string, string?>
        {
            ["page"] = page.ToString(),
            ["pageSize"] = pageSize.ToString()
        };
        
        // Add any additional query parameters
        if (additionalParams != null)
        {
            var properties = additionalParams.GetType().GetProperties();
            foreach (var prop in properties)
            {
                var value = prop.GetValue(additionalParams);
                if (value != null)
                {
                    queryParams[prop.Name] = value.ToString();
                }
            }
        }
        
        var queryString = string.Join("&", 
            queryParams.Where(kvp => kvp.Value != null)
                       .Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value!)}"));
        
        return $"{baseUrl}{currentPath}?{queryString}";
    }
}

