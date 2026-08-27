using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface ICourseService
    {
        Task<List<CourseTreeDto>> GetPublicCourseTreeAsync();
        Task<LessonMediaResponseDto?> GetLessonMediaAccessAsync(int lessonId, int userId);
    }
}
