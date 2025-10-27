using domain.account;
using domain.account.entities;
using domain.account.ValueObjects;
using service_patterns;

namespace domain.ratingHistory;

public class RatingHistory: AggregateRoot
{
    public Guid AccountId { get; set; }
    private List<TitleRating> _ratings { get; set; } = [];
    public IReadOnlyCollection<TitleRating> Ratings => _ratings;

    public void AddTitleRating(TitleRating rating)
    {
        _ratings.Add(rating);
    }
    
    public void RatingHistory(Account account, Title title, Rating rating)
    {
        Ratings.Add();
    }
}