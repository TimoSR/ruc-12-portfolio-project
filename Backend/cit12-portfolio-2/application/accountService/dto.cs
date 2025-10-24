namespace application.accountService;

// Located in your Application project
public record CreateAccountCommand(string Email, string Username, string Password);
public record AccountDto(Guid Id, string Email, string Username);