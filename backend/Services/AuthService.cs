using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BackendAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return new AuthResponseDto { Success = false, Message = "Email and Password are required." };
            }

            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower().Trim());
            if (existingUser != null)
            {
                return new AuthResponseDto { Success = false, Message = "Email address is already registered." };
            }

            // Explicit user form selection precedence for CountryCode and CurrencyClaim
            string country = string.IsNullOrWhiteSpace(dto.CountryCode) ? "ID" : dto.CountryCode.ToUpper().Trim();
            string currency = (country == "ID") ? "IDR" : "USD";

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 11);

            var newUser = new User
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.ToLower().Trim(),
                PasswordHash = passwordHash,
                Role = "Student",
                CountryCode = country,
                Currency = currency,
                IsSubscribed = false,
                FailedLoginCount = 0,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            return await GenerateAuthResponseAsync(newUser);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return new AuthResponseDto { Success = false, Message = "Email and Password are required." };
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower().Trim());
            if (user == null)
            {
                return new AuthResponseDto { Success = false, Message = "Invalid email or password." };
            }

            // 15-minute brute-force account lockout policy after 5 failed attempts
            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            {
                var remainingMinutes = Math.Ceiling((user.LockoutEnd.Value - DateTime.UtcNow).TotalMinutes);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Account locked due to 5 failed login attempts. Try again in {remainingMinutes} minute(s)."
                };
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                user.FailedLoginCount++;
                if (user.FailedLoginCount >= 5)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                    user.FailedLoginCount = 0; // Reset counter for next cycle
                }
                await _db.SaveChangesAsync();

                return new AuthResponseDto { Success = false, Message = "Invalid email or password." };
            }

            // Successful login -> Reset lockout & failed count
            user.FailedLoginCount = 0;
            user.LockoutEnd = null;
            await _db.SaveChangesAsync();

            return await GenerateAuthResponseAsync(user);
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return new AuthResponseDto { Success = false, Message = "Refresh token is required." };
            }

            var tokenRecord = await _db.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == refreshToken);

            if (tokenRecord == null || tokenRecord.IsRevoked || tokenRecord.ExpiresAt < DateTime.UtcNow)
            {
                return new AuthResponseDto { Success = false, Message = "Invalid or expired refresh token." };
            }

            // Rotate Refresh Token
            tokenRecord.IsRevoked = true;

            var newRefreshToken = GenerateSecureTokenString();
            tokenRecord.ReplacedByToken = newRefreshToken;

            var newRecord = new RefreshToken
            {
                UserId = tokenRecord.UserId,
                Token = newRefreshToken,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            _db.RefreshTokens.Add(newRecord);
            await _db.SaveChangesAsync();

            var jwtToken = GenerateJwtAccessToken(tokenRecord.User);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Token refreshed successfully.",
                AccessToken = jwtToken,
                RefreshToken = newRefreshToken,
                User = MapToUserDto(tokenRecord.User)
            };
        }

        public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken)) return false;

            var tokenRecord = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken);
            if (tokenRecord == null || tokenRecord.IsRevoked) return false;

            tokenRecord.IsRevoked = true;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RequestPasswordResetAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower().Trim());
            if (user == null) return true; // Silent return for security

            var resetTokenStr = Guid.NewGuid().ToString("N");
            var resetRecord = new PasswordResetToken
            {
                UserId = user.Id,
                Token = resetTokenStr,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                IsUsed = false
            };

            _db.PasswordResetTokens.Add(resetRecord);
            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword)) return false;

            var resetRecord = await _db.PasswordResetTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == dto.Token && !r.IsUsed && r.ExpiresAt > DateTime.UtcNow);

            if (resetRecord == null) return false;

            resetRecord.IsUsed = true;
            resetRecord.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword, workFactor: 11);
            resetRecord.User.FailedLoginCount = 0;
            resetRecord.User.LockoutEnd = null; // Clear lockout on reset

            await _db.SaveChangesAsync();
            return true;
        }

        private async Task<AuthResponseDto> GenerateAuthResponseAsync(User user)
        {
            var accessToken = GenerateJwtAccessToken(user);
            var refreshTokenStr = GenerateSecureTokenString();

            var refreshTokenRecord = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenStr,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            _db.RefreshTokens.Add(refreshTokenRecord);
            await _db.SaveChangesAsync();

            return new AuthResponseDto
            {
                Success = true,
                Message = "Authentication successful.",
                AccessToken = accessToken,
                RefreshToken = refreshTokenStr,
                User = MapToUserDto(user)
            };
        }

        private string GenerateJwtAccessToken(User user)
        {
            var jwtSecret = _config["Jwt:Secret"] ?? _config["JWT_SECRET"] ?? Environment.GetEnvironmentVariable("JWT_SECRET") ?? "PhanilieSuperSecretJwtKey2026_ProductionGradeKey123456789";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("CountryCode", user.CountryCode),
                new Claim("CurrencyClaim", user.Currency)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? _config["JWT_ISSUER"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "PhanilieMusic",
                audience: _config["Jwt:Audience"] ?? _config["JWT_AUDIENCE"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "PhanilieStudents",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateSecureTokenString()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CountryCode = user.CountryCode,
                Currency = user.Currency,
                IsSubscribed = user.IsSubscribed
            };
        }
    }
}
