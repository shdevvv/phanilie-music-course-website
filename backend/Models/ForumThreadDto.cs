namespace BackendAPI.Models
{
    public class CreateThreadDto
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = "General";
        public string Content { get; set; } = string.Empty;
    }

    public class CreateReplyDto
    {
        public string Content { get; set; } = string.Empty;
    }

    public class ReportThreadDto
    {
        public int ThreadId { get; set; }
        public string Reason { get; set; } = "Spam";
    }

    public class ForumThreadDto
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Upvotes { get; set; }
        public int RepliesCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsUpvoted { get; set; }
    }
}
