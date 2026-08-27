namespace BackendAPI.Models
{
    public class SheetMusicDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Composer { get; set; } = string.Empty;
        public string Arranger { get; set; } = string.Empty;
        public string Difficulty { get; set; } = "Intermediate";
        public string Genre { get; set; } = "Gospel";
        public string KeySignature { get; set; } = "C Major";
        public int PageCount { get; set; } = 3;
        public decimal PriceIDR { get; set; }
        public decimal PriceUSD { get; set; }
        public string ThumbnailUrl { get; set; } = string.Empty;
        public bool IsOwned { get; set; } = false;
    }

    public class UserLibraryDto
    {
        public int LibraryId { get; set; }
        public int SheetMusicId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Arranger { get; set; } = string.Empty;
        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
        public SheetMusicDto SheetMusic { get; set; } = new();
    }
}
