using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Models
{
    [Table("StoredMediaFiles")]
    public class StoredMediaFile
    {
        [Key]
        public Guid FileId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(256)]
        public string OriginalFileName { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string StoragePath { get; set; } = string.Empty;

        [Required]
        [MaxLength(64)]
        public string MimeType { get; set; } = "application/octet-stream";

        public long FileSizeBytes { get; set; }

        [Required]
        [MaxLength(32)]
        public string StorageProvider { get; set; } = "Local"; // Local, Cloud

        [MaxLength(64)]
        public string? AttachedEntityType { get; set; } // SheetMusic, Course, Lesson, Cover

        public int? AttachedEntityId { get; set; }

        public bool IsOrphaned { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
