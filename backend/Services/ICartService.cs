using System.Threading.Tasks;
using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface ICartService
    {
        Task<CartDto> GetGuestCartAsync(string cookieToken);
        Task<CartDto> AddItemToGuestCartAsync(string cookieToken, AddToCartDto dto);
        Task<CartDto> UpdateGuestCartItemAsync(string cookieToken, int itemId, int quantity);
        Task<CartDto> RemoveGuestCartItemAsync(string cookieToken, int itemId);

        Task<CartDto> GetUserCartAsync(string userId);
        Task<CartDto> AddItemToUserCartAsync(string userId, AddToCartDto dto);
        Task<CartDto> UpdateUserCartItemAsync(string userId, int itemId, int quantity);
        Task<CartDto> RemoveUserCartItemAsync(string userId, int itemId);

        Task<CartDto> SyncGuestCartToUserAsync(string cookieToken, string userId);
    }
}
