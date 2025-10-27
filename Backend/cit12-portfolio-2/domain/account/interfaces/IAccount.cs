using domain.account.ValueObjects;
using service_patterns;

namespace domain.account.interfaces;

public interface IAccount : IAggregateRoot
{
    Guid Id { get; }
    string Email { get; }
    string Username { get; }
    string Password { get; }
    DateTime CreatedAt { get; }
    void ChangeEmail(string newEmail);
    void ChangePassword(string newPassword);
    static abstract Account Create(string email, string userName, string password);
}