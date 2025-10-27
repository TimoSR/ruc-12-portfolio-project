using service_patterns;

namespace domain.account.ValueObjects;

public class Rating
{
    public Guid? Id { get; private set; }
    public Guid AccountId { get; private set; }
    public Guid TitleId { get; private set; }
    public int Score { get; private set; }
    public string? Comment { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    internal Rating(Guid id, Guid accountId, Guid titleId, int score, string? comment = null)
    {
        Id = id;
        AccountId = accountId;
        TitleId = titleId;
        Score = score;
        Comment = comment;
        CreatedAt = DateTime.UtcNow;
    }
    
    private Rating(Guid accountId, Guid titleId, int score, string? comment = null)
    {
        AccountId = accountId;
        TitleId = titleId;
        Score = score;
        Comment = comment;
        CreatedAt = DateTime.UtcNow;
    }

    public static Rating Create(Guid accountId, Guid titleId, int value, string? comment = null)
    {
        return new Rating(accountId, titleId, value, comment);
    }

    public void Update(int value, string? comment = null)
    {
        Score = value;
        Comment = comment;
        UpdatedAt = DateTime.UtcNow;
    }
}