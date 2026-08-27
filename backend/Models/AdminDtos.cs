using System;
using System.Collections.Generic;

namespace BackendAPI.Models
{
    public class PagedRequestDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Query { get; set; }
    }

    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));
    }

    public class AdminDashboardSummaryDto
    {
        public int TotalUsers { get; set; }
        public int ActiveSubscribers { get; set; }
        public int TotalSheetMusic { get; set; }
        public int TotalCourses { get; set; }
        public decimal TotalRevenueIDR { get; set; }
        public decimal TotalRevenueUSD { get; set; }
        public int PendingInquiries { get; set; }
    }

    public class AdminSheetMusicDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Composer { get; set; } = string.Empty;
        public string Instrument { get; set; } = "Piano";
        public string Difficulty { get; set; } = "Intermediate";
        public decimal PriceIDR { get; set; }
        public decimal PriceUSD { get; set; }
        public string CoverImageUrl { get; set; } = string.Empty;
        public string AudioPreviewUrl { get; set; } = string.Empty;
        public string PdfFilePath { get; set; } = string.Empty;
        public bool IsArchived { get; set; }
    }

    public class AdminCourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = "Beginner";
        public string ThumbnailUrl { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsArchived { get; set; }
        public int TopicCount { get; set; }
        public int LessonCount { get; set; }
    }

    public class AdminOrderAuditDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string ItemTitle { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "IDR";
        public string Gateway { get; set; } = "Midtrans";
        public string TransactionId { get; set; } = string.Empty;
        public string Status { get; set; } = "Completed";
        public DateTime CreatedAt { get; set; }
    }

    public class AdminUserRoleUpdateDto
    {
        public int UserId { get; set; }
        public string Role { get; set; } = "Student";
        public bool IsSubscribed { get; set; }
    }

    public class AdminInquiryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, InProgress, Resolved
        public string? AdminNotes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
