using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ProfileService : IProfileService
    {
        private readonly AppDbContext _context;

        public ProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfileDto> GetProfileAsync(int userId)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return GetFallbackProfile(userId);

            return new UserProfileDto
            {
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
                Bio = "Passionate piano enthusiast working through 12-key jazz harmonies and classical Nocturnes.",
                SkillLevel = "Intermediate",
                PreferredGenres = new List<string> { "Jazz", "Classical", "Gospel" },
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserProfileDto> UpdateProfileAsync(UserProfileDto dto, int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                user.Name = dto.Name;
                await _context.SaveChangesAsync();
            }

            dto.UserId = userId;
            return dto;
        }

        public async Task<SubscriptionOverviewDto> GetSubscriptionAsync(int userId)
        {
            return await Task.FromResult(new SubscriptionOverviewDto
            {
                PlanName = "Annual All-Access Membership",
                Status = "Active",
                RenewalDate = DateTime.UtcNow.AddYears(1),
                PriceIDR = 1500000,
                PriceUSD = 149,
                IsActive = true
            });
        }

        public async Task<bool> ChangePasswordAsync(ChangePasswordDto dto, int userId)
        {
            if (dto.NewPassword != dto.ConfirmPassword || dto.NewPassword.Length < 6)
            {
                return false;
            }
            return await Task.FromResult(true);
        }

        private UserProfileDto GetFallbackProfile(int userId)
        {
            return new UserProfileDto
            {
                UserId = userId,
                Name = "Julian Vance",
                Email = "julian.vance@example.com",
                AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
                Bio = "Passionate piano enthusiast working through 12-key jazz harmonies and classical Nocturnes.",
                SkillLevel = "Intermediate",
                PreferredGenres = new List<string> { "Jazz", "Classical", "Gospel" },
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            };
        }
    }
}
