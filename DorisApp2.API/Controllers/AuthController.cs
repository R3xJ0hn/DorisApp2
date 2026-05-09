
using DorisApp2.API.Data;
using DorisApp2.API.Dtos;
using DorisApp2.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DorisApp2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext context, IConfiguration config) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var emailExists = await context.Users
            .AnyAsync(u => u.Email == request.Email);

        if (emailExists)
        {
            return Conflict(new { message = "Email is already registered." });
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Customer"
        };

        context.Users.Add(user);

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException exception) when (IsUniqueEmailConflict(exception))
        {
            return Conflict(new { message = "Email is already registered." });
        }

        var token = GenerateJwtToken(user);
        SetAuthCookie(token);

        return Ok(new AuthResponse
        {
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = GenerateJwtToken(user);
        SetAuthCookie(token);

        return Ok(new AuthResponse
        {
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token", GetCookieOptions());
        return NoContent();
    }

    private string GenerateJwtToken(User user)
    {
        var key = config["Jwt:Key"]!;
        var issuer = config["Jwt:Issuer"]!;
        var audience = config["Jwt:Audience"]!;
        var expiresInMinutes = int.Parse(config["Jwt:ExpiresInMinutes"]!);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role),
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private void SetAuthCookie(string token)
    {
        Response.Cookies.Append("access_token", token, GetCookieOptions());
    }

    private CookieOptions GetCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(GetJwtExpiresInMinutes())
        };
    }

    private int GetJwtExpiresInMinutes()
    {
        return int.Parse(config["Jwt:ExpiresInMinutes"]!);
    }

    private static bool IsUniqueEmailConflict(DbUpdateException exception)
    {
        for (var current = exception.InnerException; current is not null; current = current.InnerException)
        {
            if (current is SqlException sqlException &&
                sqlException.Errors.Cast<SqlError>().Any(error => error.Number is 2601 or 2627))
            {
                return true;
            }
        }

        return false;
    }
}
