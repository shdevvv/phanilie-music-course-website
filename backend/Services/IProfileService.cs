using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface IProfileService
    {
        Task<UserProfileDto> GetProfileAsync(int userId);
        Task<UserProfileDto> UpdateProfileAsync(UserProfileDto dto, int userId);
        Task<SubscriptionOverviewDto> GetSubscriptionAsync(int userId);
        Task<bool> ChangePasswordAsync(ChangePasswordDto dto, int userId);
    }
}
