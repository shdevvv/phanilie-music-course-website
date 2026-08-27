namespace BackendAPI.Models
{
    public class LessonPublicDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
        public int SequenceOrder { get; set; }
    }

    public class TopicDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int SequenceOrder { get; set; }
        public List<LessonPublicDto> Lessons { get; set; } = new();
    }

    public class CourseTreeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Level { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced
        public string Description { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public List<TopicDto> Topics { get; set; } = new();
    }

    public class LessonMediaResponseDto
    {
        public int LessonId { get; set; }
        public string VideoStreamUrl { get; set; } = string.Empty;
        public string PdfDownloadUrl { get; set; } = string.Empty;
    }
}
