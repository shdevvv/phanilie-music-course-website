using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class CartService : ICartService
    {
        private readonly AppDbContext _db;

        public CartService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<CartDto> GetGuestCartAsync(string cookieToken)
        {
            if (string.IsNullOrWhiteSpace(cookieToken))
                return new CartDto();

            var session = await _db.GuestCartSessions
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.GuestCookieToken == cookieToken);

            if (session == null)
                return new CartDto();

            session.LastAccessedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return MapGuestItemsToCartDto(session.Items);
        }

        public async Task<CartDto> AddItemToGuestCartAsync(string cookieToken, AddToCartDto dto)
        {
            if (string.IsNullOrWhiteSpace(cookieToken))
                cookieToken = Guid.NewGuid().ToString();

            var session = await _db.GuestCartSessions
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.GuestCookieToken == cookieToken);

            if (session == null)
            {
                session = new GuestCartSession
                {
                    GuestCookieToken = cookieToken,
                    CreatedAt = DateTime.UtcNow,
                    LastAccessedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(30)
                };
                _db.GuestCartSessions.Add(session);
                await _db.SaveChangesAsync();
            }

            var existingItem = session.Items.FirstOrDefault(i => i.MusicItemId == dto.MusicItemId);
            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                existingItem.PriceIDR = dto.PriceIDR;
                existingItem.PriceUSD = dto.PriceUSD;
            }
            else
            {
                var newItem = new GuestCartItem
                {
                    SessionId = session.SessionId,
                    MusicItemId = dto.MusicItemId,
                    Title = dto.Title,
                    PriceIDR = dto.PriceIDR,
                    PriceUSD = dto.PriceUSD,
                    Quantity = dto.Quantity > 0 ? dto.Quantity : 1,
                    AddedAt = DateTime.UtcNow
                };
                session.Items.Add(newItem);
            }

            session.LastAccessedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return MapGuestItemsToCartDto(session.Items);
        }

        public async Task<CartDto> UpdateGuestCartItemAsync(string cookieToken, int itemId, int quantity)
        {
            var session = await _db.GuestCartSessions
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.GuestCookieToken == cookieToken);

            if (session == null) return new CartDto();

            var item = session.Items.FirstOrDefault(i => i.Id == itemId);
            if (item != null)
            {
                if (quantity <= 0)
                {
                    _db.GuestCartItems.Remove(item);
                }
                else
                {
                    item.Quantity = quantity;
                }
                session.LastAccessedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }

            return MapGuestItemsToCartDto(session.Items);
        }

        public async Task<CartDto> RemoveGuestCartItemAsync(string cookieToken, int itemId)
        {
            return await UpdateGuestCartItemAsync(cookieToken, itemId, 0);
        }

        public async Task<CartDto> GetUserCartAsync(string userId)
        {
            var items = await _db.UserCartItems
                .Where(i => i.UserId == userId)
                .ToListAsync();

            return MapUserItemsToCartDto(items);
        }

        public async Task<CartDto> AddItemToUserCartAsync(string userId, AddToCartDto dto)
        {
            var existingItem = await _db.UserCartItems
                .FirstOrDefaultAsync(i => i.UserId == userId && i.MusicItemId == dto.MusicItemId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                existingItem.PriceIDR = dto.PriceIDR;
                existingItem.PriceUSD = dto.PriceUSD;
                existingItem.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                var newItem = new UserCartItem
                {
                    UserId = userId,
                    MusicItemId = dto.MusicItemId,
                    Title = dto.Title,
                    PriceIDR = dto.PriceIDR,
                    PriceUSD = dto.PriceUSD,
                    Quantity = dto.Quantity > 0 ? dto.Quantity : 1,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.UserCartItems.Add(newItem);
            }

            await _db.SaveChangesAsync();

            var items = await _db.UserCartItems
                .Where(i => i.UserId == userId)
                .ToListAsync();

            return MapUserItemsToCartDto(items);
        }

        public async Task<CartDto> UpdateUserCartItemAsync(string userId, int itemId, int quantity)
        {
            var item = await _db.UserCartItems
                .FirstOrDefaultAsync(i => i.UserId == userId && i.Id == itemId);

            if (item != null)
            {
                if (quantity <= 0)
                {
                    _db.UserCartItems.Remove(item);
                }
                else
                {
                    item.Quantity = quantity;
                    item.UpdatedAt = DateTime.UtcNow;
                }
                await _db.SaveChangesAsync();
            }

            var items = await _db.UserCartItems
                .Where(i => i.UserId == userId)
                .ToListAsync();

            return MapUserItemsToCartDto(items);
        }

        public async Task<CartDto> RemoveUserCartItemAsync(string userId, int itemId)
        {
            return await UpdateUserCartItemAsync(userId, itemId, 0);
        }

        public async Task<CartDto> SyncGuestCartToUserAsync(string cookieToken, string userId)
        {
            if (string.IsNullOrWhiteSpace(cookieToken) || string.IsNullOrWhiteSpace(userId))
                return await GetUserCartAsync(userId);

            var session = await _db.GuestCartSessions
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.GuestCookieToken == cookieToken);

            if (session != null && session.Items.Any())
            {
                var userItems = await _db.UserCartItems
                    .Where(i => i.UserId == userId)
                    .ToListAsync();

                foreach (var guestItem in session.Items)
                {
                    var existingUserItem = userItems.FirstOrDefault(u => u.MusicItemId == guestItem.MusicItemId);
                    if (existingUserItem != null)
                    {
                        // Overwrite strategy per spec rules
                        existingUserItem.Quantity = guestItem.Quantity;
                        existingUserItem.PriceIDR = guestItem.PriceIDR;
                        existingUserItem.PriceUSD = guestItem.PriceUSD;
                        existingUserItem.UpdatedAt = DateTime.UtcNow;
                    }
                    else
                    {
                        var newUserItem = new UserCartItem
                        {
                            UserId = userId,
                            MusicItemId = guestItem.MusicItemId,
                            Title = guestItem.Title,
                            PriceIDR = guestItem.PriceIDR,
                            PriceUSD = guestItem.PriceUSD,
                            Quantity = guestItem.Quantity,
                            UpdatedAt = DateTime.UtcNow
                        };
                        _db.UserCartItems.Add(newUserItem);
                    }
                }

                _db.GuestCartSessions.Remove(session);
                await _db.SaveChangesAsync();
            }

            return await GetUserCartAsync(userId);
        }

        private CartDto MapGuestItemsToCartDto(IEnumerable<GuestCartItem> items)
        {
            var dtoList = items.Select(i => new CartItemDto
            {
                Id = i.Id,
                MusicItemId = i.MusicItemId,
                Title = i.Title,
                PriceIDR = i.PriceIDR,
                PriceUSD = i.PriceUSD,
                Quantity = i.Quantity,
                IsPriceAdjusted = false
            }).ToList();

            return new CartDto
            {
                Items = dtoList,
                TotalItems = dtoList.Sum(i => i.Quantity),
                SubtotalIDR = dtoList.Sum(i => i.PriceIDR * i.Quantity),
                SubtotalUSD = dtoList.Sum(i => i.PriceUSD * i.Quantity),
                Currency = "IDR"
            };
        }

        private CartDto MapUserItemsToCartDto(IEnumerable<UserCartItem> items)
        {
            var dtoList = items.Select(i => new CartItemDto
            {
                Id = i.Id,
                MusicItemId = i.MusicItemId,
                Title = i.Title,
                PriceIDR = i.PriceIDR,
                PriceUSD = i.PriceUSD,
                Quantity = i.Quantity,
                IsPriceAdjusted = false
            }).ToList();

            return new CartDto
            {
                Items = dtoList,
                TotalItems = dtoList.Sum(i => i.Quantity),
                SubtotalIDR = dtoList.Sum(i => i.PriceIDR * i.Quantity),
                SubtotalUSD = dtoList.Sum(i => i.PriceUSD * i.Quantity),
                Currency = "IDR"
            };
        }
    }
}
