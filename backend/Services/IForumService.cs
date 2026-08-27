using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface IForumService
    {
        Task<List<ForumThreadDto>> GetThreadsAsync(string? category);
        Task<ForumThreadDto> CreateThreadAsync(CreateThreadDto dto, int userId);
        Task<bool> UpvoteThreadAsync(int threadId, int userId);
        Task<bool> ReportThreadAsync(int threadId, string reason, int userId);
    }
}
