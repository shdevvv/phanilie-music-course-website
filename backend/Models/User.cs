using System;
using System.Collections.Generic;

namespace BackendAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string CountryCode { get; set; } = "ID";
        public string Currency { get; set; } = "IDR";
        public string Role { get; set; } = "Student"; // Student, Subscriber, Admin
        public bool IsSubscribed { get; set; } = false;
        public DateTime? SubscriptionExpiresAt { get; set; }
        public int FailedLoginCount { get; set; } = 0;
        public DateTime? LockoutEnd { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<UserLibrary> LibraryItems { get; set; } = new List<UserLibrary>();
        public ICollection<UserProgress> LessonProgresses { get; set; } = new List<UserProgress>();
        public ICollection<PracticeLog> PracticeLogs { get; set; } = new List<PracticeLog>();
        public ICollection<UserTodo> Todos { get; set; } = new List<UserTodo>();
        public ICollection<UserBadge> Badges { get; set; } = new List<UserBadge>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
