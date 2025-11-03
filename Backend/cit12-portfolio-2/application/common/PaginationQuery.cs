namespace application.common;

public record PaginationQuery(int Page = 1, int PageSize = 20)
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    
    public int ActualPage => Page < 1 ? 1 : Page;
    
    public int ActualPageSize => PageSize switch
    {
        <= 0 => DefaultPageSize,
        > MaxPageSize => MaxPageSize,
        _ => PageSize
    };
    
    public int Skip => (ActualPage - 1) * ActualPageSize;
    
    public int Take => ActualPageSize;
}

