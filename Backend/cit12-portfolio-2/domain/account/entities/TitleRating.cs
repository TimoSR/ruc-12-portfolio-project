using service_patterns;

namespace domain.account.entities;

public class TitleRating : Entity
{
    public Guid Id { get; set; }
    public Guid TitleId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    private TitleRating(){}
    
    private TitleRating(Guid accountId, Guid titleId, int rating, string comment, DateTime createdAt)
    {
        
    }
    
    public static TitleRating Create(Guid accountId, Guid titleId, int rating, string comment, DateTime createdAt)
    {
        return new TitleRating(accountId, titleId, rating, comment, createdAt);
    }
}