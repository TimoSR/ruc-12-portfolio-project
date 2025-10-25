namespace application.accountService;

// Located in your Application project
public record CreateAccountCommandDto(string Email, string Username, string Password);
public record AccountDto(Guid Id, string Username);