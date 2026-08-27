using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync(int userId);
        Task<List<UserTodoDto>> GetTodosAsync(int userId);
        Task<UserTodoDto> CreateTodoAsync(CreateTodoDto dto, int userId);
    }
}
