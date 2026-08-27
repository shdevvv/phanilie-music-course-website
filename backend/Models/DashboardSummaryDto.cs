namespace BackendAPI.Models
{
    public class RecommendedLessonDto
    {
        public int LessonId { get; set; }
        public int LevelNumber { get; set; }
        public string TopicTitle { get; set; } = string.Empty;
        public string LessonTitle { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
        public string VideoUrl { get; set; } = string.Empty;
    }

    public class DashboardSummaryDto
    {
        public int OverallMasteryPct { get; set; }
        public int CompletedLessonsCount { get; set; }
        public int TotalLessonsCount { get; set; }
        public int TotalPracticeMinutes { get; set; }
        public int TotalXP { get; set; }
        public RecommendedLessonDto NextRecommendedLesson { get; set; } = new();
    }

    public class UserTodoDto
    {
        public int Id { get; set; }
        public string TaskDescription { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateTodoDto
    {
        public string TaskDescription { get; set; } = string.Empty;
    }
}
