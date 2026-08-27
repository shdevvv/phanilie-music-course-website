using System;
using Microsoft.AspNetCore.Http;

namespace BackendAPI.Models
{
    public class MediaUploadDto
    {
        public IFormFile? File { get; set; }
        public string? AttachedEntityType { get; set; }
        public int? AttachedEntityId { get; set; }
    }

    public class MediaFileResponseDto
    {
        public Guid FileId { get; set; }
        public string OriginalFileName { get; set; } = string.Empty;
        public string PublicUrl { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string StorageProvider { get; set; } = "Local";
        public DateTime CreatedAt { get; set; }
    }

    public class SignedTokenResponseDto
    {
        public Guid FileId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string StreamUrl { get; set; } = string.Empty;
    }

    public class AttachMediaDto
    {
        public Guid FileId { get; set; }
        public string EntityType { get; set; } = string.Empty;
        public int EntityId { get; set; }
    }
}
