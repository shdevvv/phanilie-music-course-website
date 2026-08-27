using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface IPracticeLogService
    {
        Task<List<PracticeLogDto>> GetLogsAsync(int userId);
        Task<PracticeLogDto> CreateLogAsync(CreatePracticeLogDto dto, int userId);
        Task<PracticeStreakDto> GetStreakAsync(int userId);
    }
}
