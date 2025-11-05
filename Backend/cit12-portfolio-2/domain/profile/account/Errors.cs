using service_patterns;

namespace domain.profile.account;

public static class AccountErrors
{
    public static readonly Error DuplicateUsername = new("Account.DuplicateUsername", "Username is already taken.");
    public static readonly Error DuplicateEmail = new("Account.DuplicateEmail", "Email is already in use.");
    public static readonly Error NotFound = new("Account.NotFound", "Account does not exist.");
}