using System;

namespace BackendAPI.Models
{
    public class UserProgress
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int LessonId { get; set; }
        public Lesson? Lesson { get; set; }
        public bool IsCompleted { get; set; } = true;
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }

    public class PracticeLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int DurationMinutes { get; set; }
        public DateTime PracticeDate { get; set; } = DateTime.UtcNow.Date;
        public string FocusTitle { get; set; } = string.Empty;
        public string Category { get; set; } = "Repertoire";
        public string Notes { get; set; } = string.Empty;
        public string Rating { get; set; } = "Challenging";
    }

    public class UserTodo
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string TaskDescription { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Badge
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public string RequirementType { get; set; } = "LessonCount"; // LessonCount, PracticeMinutes, Streak
        public int RequirementValue { get; set; } = 5;
    }

    public class UserBadge
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int BadgeId { get; set; }
        public Badge? Badge { get; set; }
        public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
    }

    public class LiveMasterclass
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ScheduledAt { get; set; }
        public int DurationMinutes { get; set; } = 60;
        public string MeetingLink { get; set; } = string.Empty;
        public string RecordingUrl { get; set; } = string.Empty;
        public string Status { get; set; } = "Upcoming"; // Upcoming, Live, Ended
    }

    public class ContactMessage
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsReplied { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class NewsletterSubscription
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string UnsubscribeToken { get; set; } = Guid.NewGuid().ToString("N");
        public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    }

    public class MembershipPlan
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Monthly, Quarterly, Annual
        public string Description { get; set; } = string.Empty;
        public int DurationDays { get; set; } = 30;
        public decimal PriceIDR { get; set; } = 150000;
        public decimal PriceUSD { get; set; } = 15.00m;
        public bool IsActive { get; set; } = true;
    }
}
