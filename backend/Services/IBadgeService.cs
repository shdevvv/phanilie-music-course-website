using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface IBadgeService
    {
        Task<List<UserBadgeDto>> GetUserBadgesAsync(int userId);
        Task<List<UserBadgeDto>> EvaluateUserBadgesAsync(int userId);
    }
}
