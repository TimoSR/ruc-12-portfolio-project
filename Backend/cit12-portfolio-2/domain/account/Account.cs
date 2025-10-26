using domain.account.entities;
using domain.account.interfaces;
using domain.account.ValueObjects;
using service_patterns;

namespace domain.account;

public class Account : AggregateRoot, IAccount
{
    public Guid Id { get; private set; }
    public string Email {get; private set;}
    public string Username {get; private set;}
    public string Password {get; private set;}
    public DateTime CreatedAt { get; private set; }
    private readonly List<Rating> _ratingsHistory = [];
     public IReadOnlyCollection<Rating> RatingsHistory() => _ratingsHistory.AsReadOnly();
    
    internal Account(Guid id, string email, string username, string password, DateTime createdAt)
    {
        Id = id;
        Email = email;
        Username = username;
        Password = password;
        CreatedAt = createdAt;
    }
    
    internal Account(
        Guid id, 
        string email, 
        string username, 
        string password, 
        DateTime createdAt, 
        List<Rating> ratings)
    {
        Id = id;
        Email = email;
        Username = username;
        Password = password;
        CreatedAt = createdAt;
    }
    
    private Account(string email, string username, string password)
    {
        Email = email.Trim();
        Username = username.Trim();
        Password = password;
        CreatedAt = DateTime.UtcNow;

        AddDomainEvent(new AccountCreatedEvent(Email, Username, CreatedAt));
    }
    
    public static Account Create(string email, string username, string password)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new InvalidEmailException();
        if (string.IsNullOrWhiteSpace(username))
            throw new InvalidUserNameException();
        if (string.IsNullOrWhiteSpace(password))
            throw new InvalidPasswordException();

        var account = new Account(email, username, password);
        return account;
    }
    
    public void ChangeEmail(string newEmail)
    {
        if (string.IsNullOrWhiteSpace(newEmail))
            throw new InvalidEmailException();

        newEmail = newEmail.Trim();

        if (newEmail.Equals(Email, StringComparison.OrdinalIgnoreCase))
            return; 
        
        Email = newEmail;
        AddDomainEvent(new EmailChangedEvent(Id, newEmail, DateTime.UtcNow));
    }

    public void ChangePassword(string newPassword)
    {
        if (string.IsNullOrWhiteSpace(newPassword))
            throw new InvalidPasswordException();

        if (newPassword == Password)
            return;

        Password = newPassword;
        AddDomainEvent(new PasswordChangedEvent(Id, DateTime.UtcNow));
    }

    public Rating? GetRating(Guid titleId)
    {
        return _ratingsHistory.FirstOrDefault(r => r.TitleId == titleId);
    }
    
    public void AddOrUpdateRating(Guid titleId, int value, string? comment = null)
    {
        var existing = GetRating(titleId);
        if (existing != null)
        {
            existing.Update(value, comment);
            return;
        }

        var newRating = Rating.Create(Id, titleId, value, comment);
        _ratingsHistory.Add(newRating);
    }

    public void RemoveRating(Guid titleId)
    {
        var existing = GetRating(titleId);
        if (existing != null)
        {
            _ratingsHistory.Remove(existing);
        }
    }
}