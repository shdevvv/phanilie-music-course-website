using System;
using System.Threading.Tasks;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        private const string CartCookieName = "phanilie_guest_cart";

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private string GetOrCreateGuestCookieToken()
        {
            if (Request.Cookies.TryGetValue(CartCookieName, out var cookieToken) && !string.IsNullOrWhiteSpace(cookieToken))
            {
                return cookieToken;
            }

            var newToken = Guid.NewGuid().ToString();
            Response.Cookies.Append(CartCookieName, newToken, new Microsoft.AspNetCore.Http.CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(30)
            });

            return newToken;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart([FromQuery] string? userId)
        {
            if (!string.IsNullOrWhiteSpace(userId))
            {
                var userCart = await _cartService.GetUserCartAsync(userId);
                return Ok(userCart);
            }

            var cookieToken = GetOrCreateGuestCookieToken();
            var guestCart = await _cartService.GetGuestCartAsync(cookieToken);
            return Ok(guestCart);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItem([FromBody] AddToCartDto dto, [FromQuery] string? userId)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.MusicItemId))
                return BadRequest("Invalid cart item data");

            if (!string.IsNullOrWhiteSpace(userId))
            {
                var userCart = await _cartService.AddItemToUserCartAsync(userId, dto);
                return Ok(userCart);
            }

            var cookieToken = GetOrCreateGuestCookieToken();
            var guestCart = await _cartService.AddItemToGuestCartAsync(cookieToken, dto);
            return Ok(guestCart);
        }

        [HttpPut("items/{itemId:int}")]
        public async Task<IActionResult> UpdateItem(int itemId, [FromBody] UpdateCartItemDto dto, [FromQuery] string? userId)
        {
            if (!string.IsNullOrWhiteSpace(userId))
            {
                var userCart = await _cartService.UpdateUserCartItemAsync(userId, itemId, dto.Quantity);
                return Ok(userCart);
            }

            var cookieToken = GetOrCreateGuestCookieToken();
            var guestCart = await _cartService.UpdateGuestCartItemAsync(cookieToken, itemId, dto.Quantity);
            return Ok(guestCart);
        }

        [HttpDelete("items/{itemId:int}")]
        public async Task<IActionResult> RemoveItem(int itemId, [FromQuery] string? userId)
        {
            if (!string.IsNullOrWhiteSpace(userId))
            {
                var userCart = await _cartService.RemoveUserCartItemAsync(userId, itemId);
                return Ok(userCart);
            }

            var cookieToken = GetOrCreateGuestCookieToken();
            var guestCart = await _cartService.RemoveGuestCartItemAsync(cookieToken, itemId);
            return Ok(guestCart);
        }

        [HttpPost("sync")]
        public async Task<IActionResult> SyncCart([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("User ID is required for cart sync");

            var cookieToken = GetOrCreateGuestCookieToken();
            var syncedCart = await _cartService.SyncGuestCartToUserAsync(cookieToken, userId);

            Response.Cookies.Delete(CartCookieName);

            return Ok(syncedCart);
        }
    }
}
