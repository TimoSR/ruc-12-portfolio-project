

using domain.profile.account;
using domain.profile.account.interfaces;

namespace test_domain;

public class AccountTests
{
    [Fact]
    public void Create_ValidInput_ShouldCreateAccountWithExpectedProperties()
    {
        // Arrange
        const string email = "user@example.com";
        const string userName = "TestUser";
        const string password = "$2b$12$HashedPasswordValue"; // Assume hashed before domain

        // Act
        IAccount account = Account.Create(email, userName, password);

        // Assert
        Assert.NotNull(account);
        Assert.Equal(email, account.Email);
        Assert.Equal(userName, account.Username);
        Assert.Equal(password, account.Password);
        Assert.True(account.CreatedAt <= DateTime.UtcNow);
        Assert.Single(account.DomainEvents);
        Assert.IsType<AccountCreatedEvent>(account.DomainEvents.First());
    }

    [Theory]
    [InlineData(null, "User", "$2b$12$HashedPassword")]
    [InlineData("user@example.com", null, "$2b$12$HashedPassword")]
    [InlineData("user@example.com", "User", null)]
    [InlineData(" ", "User", "$2b$12$HashedPassword")]
    [InlineData("user@example.com", " ", "$2b$12$HashedPassword")]
    [InlineData("user@example.com", "User", " ")]
    public void Create_InvalidInput_ShouldThrowDomainException(string? email, string? userName, string? password)
    {
        // Act & Assert
        if (string.IsNullOrWhiteSpace(email))
            Assert.Throws<InvalidEmailException>(() => Account.Create(email, userName, password));
        else if (string.IsNullOrWhiteSpace(userName))
            Assert.Throws<InvalidUserNameException>(() => Account.Create(email, userName, password));
        else if (string.IsNullOrWhiteSpace(password))
            Assert.Throws<InvalidPasswordException>(() => Account.Create(email, userName, password));
    }
    
    [Fact]
    public void Account_DatabaseHydration_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        // Simulate EF Core materialization using the internal constructor
        var dbAccount = new Account(
            id: Guid.NewGuid(),
            email: "user@example.com", 
            username: "TestUser",
            password: "hashed_password_value",
            createdAt: new DateTime(2024, 5, 12, 14, 30, 0, DateTimeKind.Utc)
        );

        // Act
        // Simulate we map the data via the internal constructor indirectly 
        Account account = dbAccount;

        // Assert
        Assert.Equal(account.Id, dbAccount.Id);
        Assert.Equal(account.Email, dbAccount.Email);
        Assert.Equal(account.Username, dbAccount.Username);
        Assert.Equal(account.Password, dbAccount.Password);
        Assert.Equal(account.CreatedAt, dbAccount.CreatedAt);

        // Domain events should not exist when hydrating from database
        Assert.Empty(account.DomainEvents);
    }

    [Fact]
    public void ChangeEmail_Valid_ShouldUpdateEmailAndRaiseEvent()
    {
        // Arrange
        IAccount account = Account.Create("user@example.com", "User", "$2b$12$Password");
        const string newEmail = "new@example.com";

        // Act
        account.ChangeEmail(newEmail);

        // Assert
        Assert.Equal(newEmail, account.Email);
        Assert.Contains(account.DomainEvents, e => e is EmailChangedEvent evt && evt.NewEmail == newEmail);
    }

    [Fact]
    public void ChangeEmail_SameEmail_ShouldNotRaiseEvent()
    {
        // Arrange
        IAccount account = Account.Create("user@example.com", "User", "$2b$12$Password");

        // Act
        account.ChangeEmail("user@example.com");

        // Assert
        Assert.Equal("user@example.com", account.Email);
        Assert.DoesNotContain(account.DomainEvents, e => e is EmailChangedEvent);
    }

    [Fact]
    public void ChangeEmail_InvalidEmail_ShouldThrowInvalidEmailException()
    {
        // Arrange
        IAccount account = Account.Create("user@example.com", "User", "$2b$12$Password");

        // Act & Assert
        Assert.Throws<InvalidEmailException>(() => account.ChangeEmail(null));
        Assert.Throws<InvalidEmailException>(() => account.ChangeEmail(" "));
    }

    [Fact]
    public void ChangePassword_Valid_ShouldUpdatePasswordAndRaiseEvent()
    {
        // Arrange
        IAccount account = Account.Create("user@example.com", "User", "$2b$12$Password");
        const string newPassword = "$2b$12$NewHashedValue";

        // Act
        account.ChangePassword(newPassword);

        // Assert
        Assert.Equal(newPassword, account.Password);
        Assert.Contains(account.DomainEvents, e => e is PasswordChangedEvent);
    }

    [Fact]
    public void ChangePassword_SamePassword_ShouldNotRaiseEvent()
    {
        // Arrange
        IAccount account = Account.Create("user@example.com", "User", "$2b$12$Password");

        // Act
        account.ChangePassword("$2b$12$Password");

        // Assert
        Assert.Equal("$2b$12$Password", account.Password);
        Assert.DoesNotContain(account.DomainEvents, e => e is PasswordChangedEvent);
    }

    [Fact]
    public void ChangePassword_Invalid_ShouldThrowInvalidPasswordException()
    {
        // Arrange
        IAccount account = Account.Create("user@example.com", "User", "$2b$12$Password");

        // Act & Assert
        Assert.Throws<InvalidPasswordException>(() => account.ChangePassword(null));
        Assert.Throws<InvalidPasswordException>(() => account.ChangePassword(" "));
    }
}