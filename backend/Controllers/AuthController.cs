using System;
using System.Threading.Tasks;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILocalizationService _localizationService;
        private const string RefreshTokenCookieName = "phanilie_refresh_token";

        public AuthController(IAuthService authService, ILocalizationService localizationService)
        {
            _authService = authService;
            _localizationService = localizationService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success) return BadRequest(result);

            SetRefreshTokenCookie(result.RefreshToken);
            return Ok(result);
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success) return Unauthorized(result);

            SetRefreshTokenCookie(result.RefreshToken);
            return Ok(result);
        }

        [HttpGet("geoip")]
        public IActionResult GetGeoIp()
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var geoInfo = _localizationService.ResolveCountryFromIp(ip, userAgent);
            return Ok(geoInfo);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
            {
                return BadRequest(new AuthResponseDto { Success = false, Message = "Refresh token cookie missing." });
            }

            var result = await _authService.RefreshTokenAsync(refreshToken);
            if (!result.Success) return Unauthorized(result);

            SetRefreshTokenCookie(result.RefreshToken);
            return Ok(result);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken))
            {
                await _authService.RevokeRefreshTokenAsync(refreshToken);
                Response.Cookies.Delete(RefreshTokenCookieName);
            }

            return Ok(new { message = "Logged out successfully." });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var result = await _authService.RequestPasswordResetAsync(dto.Email);
            return Ok(new { success = true, message = "If the email is registered, a password reset link has been dispatched." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var success = await _authService.ResetPasswordAsync(dto);
            if (!success) return BadRequest(new { success = false, message = "Invalid or expired password reset token." });

            return Ok(new { success = true, message = "Password has been successfully reset. You may now sign in." });
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken)) return;

            Response.Cookies.Append(RefreshTokenCookieName, refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
        }
    }
}
