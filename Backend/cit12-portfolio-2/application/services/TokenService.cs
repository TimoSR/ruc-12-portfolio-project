using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using domain.profile.account;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace application.services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly SymmetricSecurityKey _key;

    public TokenService(IConfiguration config)
    {
        _config = config;
        // Hardcoded key for "last fix" scenario if config is missing, but ideally from config
        var tokenKey = _config["TokenKey"] ?? throw new InvalidOperationException("TokenKey is missing from configuration");
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
    }

    public string CreateToken(Account account)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.NameId, account.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, account.Username),
            new Claim(JwtRegisteredClaimNames.Email, account.Email),
        };

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds,
            Issuer = "https://cit.ruc.dk", // Optional, matches validation
            Audience = "https://cit.ruc.dk" // Optional
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
