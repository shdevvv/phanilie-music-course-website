using BackendAPI.Models;

namespace BackendAPI.Services
{
    public class SearchService : ISearchService
    {
        public Task<SearchResponseDto> SearchCatalogAsync(string query, int limit = 20)
        {
            var sanitized = (query ?? string.Empty).Trim();
            if (sanitized.Length < 2)
            {
                return Task.FromResult(new SearchResponseDto
                {
                    Query = sanitized,
                    TotalCount = 0
                });
            }

            var q = sanitized.ToLowerInvariant();

            var sampleLessons = new List<SearchResultItemDto>
            {
                new SearchResultItemDto
                {
                    Id = "les-1",
                    Title = "Mastering Gospel & Jazz Progression Essentials",
                    Category = "Lesson",
                    Subtitle = "Advanced Chords • Stephanie Halim",
                    ThumbnailUrl = "/coversheets/sheet1.png",
                    BadgeText = "Video Lesson",
                    PriceOrDuration = "24 mins",
                    RouteUrl = "/courses"
                },
                new SearchResultItemDto
                {
                    Id = "les-2",
                    Title = "Classical Piano Technique: Beethoven & Chopin",
                    Category = "Lesson",
                    Subtitle = "Classical Mastery • Phanilie",
                    ThumbnailUrl = "/coversheets/sheet2.png",
                    BadgeText = "Video Lesson",
                    PriceOrDuration = "30 mins",
                    RouteUrl = "/courses"
                }
            }.Where(x => x.Title.ToLowerInvariant().Contains(q) || x.Subtitle.ToLowerInvariant().Contains(q)).Take(limit).ToList();

            var sampleCovers = new List<SearchResultItemDto>
            {
                new SearchResultItemDto
                {
                    Id = "cov-1",
                    Title = "Moonlight Sonata (Gospel Jazz Re-Arrangement)",
                    Category = "Performance Cover",
                    Subtitle = "Arranged by Phanilie",
                    ThumbnailUrl = "/coversheets/sheet3.png",
                    BadgeText = "Performance Video",
                    PriceOrDuration = "4 mins",
                    RouteUrl = "/covers-sheets"
                },
                new SearchResultItemDto
                {
                    Id = "cov-2",
                    Title = "Fur Elise (Jazz Ballad Solo Piano)",
                    Category = "Performance Cover",
                    Subtitle = "Arranged by Stephanie Halim",
                    ThumbnailUrl = "/coversheets/sheet4.png",
                    BadgeText = "Performance Video",
                    PriceOrDuration = "5 mins",
                    RouteUrl = "/covers-sheets"
                }
            }.Where(x => x.Title.ToLowerInvariant().Contains(q) || x.Subtitle.ToLowerInvariant().Contains(q)).Take(limit).ToList();

            var sampleSheetMusic = new List<SearchResultItemDto>
            {
                new SearchResultItemDto
                {
                    Id = "sh-1",
                    Title = "Moonlight Sonata - Full Piano Sheet PDF",
                    Category = "Sheet Music",
                    Subtitle = "L. v. Beethoven • Arr. Stephanie",
                    ThumbnailUrl = "/coversheets/sheet1.png",
                    BadgeText = "PDF Score",
                    PriceOrDuration = "$14.99",
                    RouteUrl = "/covers-sheets"
                },
                new SearchResultItemDto
                {
                    Id = "sh-2",
                    Title = "Amazing Grace (Modern Jazz Re-Harmonization)",
                    Category = "Sheet Music",
                    Subtitle = "Gospel Jazz • Arr. Phanilie",
                    ThumbnailUrl = "/coversheets/sheet2.png",
                    BadgeText = "PDF Score",
                    PriceOrDuration = "$12.00",
                    RouteUrl = "/covers-sheets"
                }
            }.Where(x => x.Title.ToLowerInvariant().Contains(q) || x.Subtitle.ToLowerInvariant().Contains(q)).Take(limit).ToList();

            var result = new SearchResponseDto
            {
                Query = sanitized,
                Lessons = sampleLessons,
                Covers = sampleCovers,
                SheetMusic = sampleSheetMusic,
                TotalCount = sampleLessons.Count + sampleCovers.Count + sampleSheetMusic.Count
            };

            return Task.FromResult(result);
        }
    }
}
