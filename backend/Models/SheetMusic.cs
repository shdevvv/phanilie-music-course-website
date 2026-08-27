using System;

namespace BackendAPI.Models
{
    public class SheetMusic
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Composer { get; set; } = string.Empty;
        public string Instrument { get; set; } = "Piano";
        public string Difficulty { get; set; } = "Intermediate";
        public decimal PriceIDR { get; set; } = 50000;
        public decimal PriceUSD { get; set; } = 5.00m;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string AudioPreviewUrl { get; set; } = string.Empty;
        public string PdfFilePath { get; set; } = string.Empty;
        public bool IsArchived { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Cover
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public int? SheetMusicId { get; set; }
        public SheetMusic? SheetMusic { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
