using domain.profile.account;

namespace application.services;

public interface ITokenService
{
    string CreateToken(Account account);
}
