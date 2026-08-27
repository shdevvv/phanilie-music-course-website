namespace BackendAPI.Models
{
    public class SearchResultItemDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // "Lesson", "Performance Cover", "Sheet Music"
        public string Subtitle { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string BadgeText { get; set; } = string.Empty;
        public string PriceOrDuration { get; set; } = string.Empty;
        public string RouteUrl { get; set; } = string.Empty;
    }

    public class SearchResponseDto
    {
        public string Query { get; set; } = string.Empty;
        public int TotalCount { get; set; }
        public List<SearchResultItemDto> Lessons { get; set; } = new();
        public List<SearchResultItemDto> Covers { get; set; } = new();
        public List<SearchResultItemDto> SheetMusic { get; set; } = new();
    }
}
