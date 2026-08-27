namespace BackendAPI.Models
{
    public class CreatePracticeLogDto
    {
        public int DurationMinutes { get; set; }
        public string FocusTitle { get; set; } = string.Empty;
        public string Category { get; set; } = "Repertoire";
        public string Notes { get; set; } = string.Empty;
        public string Rating { get; set; } = "Challenging";
    }

    public class PracticeLogDto
    {
        public int Id { get; set; }
        public DateTime SessionDate { get; set; }
        public int DurationMinutes { get; set; }
        public string FocusTitle { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string Rating { get; set; } = string.Empty;
    }

    public class PracticeStreakDto
    {
        public int CurrentStreakDays { get; set; }
        public int LongestStreakDays { get; set; }
        public int TotalPracticeMinutes { get; set; }
        public List<bool> WeeklyDays { get; set; } = new();
    }
}
