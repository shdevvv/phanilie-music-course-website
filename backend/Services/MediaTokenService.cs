using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace BackendAPI.Services
{
    public interface IMediaTokenService
    {
        string GenerateSignedToken(Guid fileId, TimeSpan validDuration);
        bool ValidateToken(Guid fileId, string token);
    }

    public class MediaTokenService : IMediaTokenService
    {
        private readonly string _hmacSecret;

        public MediaTokenService(IConfiguration config)
        {
            _hmacSecret = config["Media:HmacSecret"] ?? "PhanilieSuperSecretHmacKeyForMediaStreaming2026";
        }

        public string GenerateSignedToken(Guid fileId, TimeSpan validDuration)
        {
            var expiresAt = DateTimeOffset.UtcNow.Add(validDuration).ToUnixTimeSeconds();
            var rawData = $"{fileId}:{expiresAt}";

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_hmacSecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            var signature = Convert.ToBase64String(hash).Replace('+', '-').Replace('/', '_').TrimEnd('=');

            return $"{expiresAt}.{signature}";
        }

        public bool ValidateToken(Guid fileId, string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return false;

            var parts = token.Split('.');
            if (parts.Length != 2) return false;

            if (!long.TryParse(parts[0], out var expiresAt)) return false;

            if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > expiresAt) return false; // Token expired

            var rawData = $"{fileId}:{expiresAt}";
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_hmacSecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            var expectedSignature = Convert.ToBase64String(hash).Replace('+', '-').Replace('/', '_').TrimEnd('=');

            return string.Equals(parts[1], expectedSignature, StringComparison.Ordinal);
        }
    }
}
