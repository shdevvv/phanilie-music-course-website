using System.Collections.Generic;

namespace BackendAPI.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced
        public string ThumbnailUrl { get; set; } = string.Empty;
        public int DisplayOrder { get; set; } = 1;

        public ICollection<Topic> Topics { get; set; } = new List<Topic>();
    }

    public class Topic
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public Course? Course { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DisplayOrder { get; set; } = 1;

        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    }

    public class Lesson
    {
        public int Id { get; set; }
        public int TopicId { get; set; }
        public Topic? Topic { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string PdfUrl { get; set; } = string.Empty;
        public int DurationMinutes { get; set; } = 10;
        public bool IsFreePreview { get; set; } = false;
        public int DisplayOrder { get; set; } = 1;
    }
}
