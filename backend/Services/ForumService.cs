using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ForumService : IForumService
    {
        private readonly AppDbContext _context;

        public ForumService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ForumThreadDto>> GetThreadsAsync(string? category)
        {
            var fallback = GetFallbackThreads(category);
            return await Task.FromResult(fallback);
        }

        public async Task<ForumThreadDto> CreateThreadAsync(CreateThreadDto dto, int userId)
        {
            return await Task.FromResult(new ForumThreadDto
            {
                Id = DateToId(),
                AuthorName = "You (Student)",
                AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
                Title = dto.Title,
                Category = dto.Category,
                Content = dto.Content,
                Upvotes = 1,
                RepliesCount = 0,
                CreatedAt = DateTime.UtcNow,
                IsUpvoted = true
            });
        }

        public async Task<bool> UpvoteThreadAsync(int threadId, int userId)
        {
            return await Task.FromResult(true);
        }

        public async Task<bool> ReportThreadAsync(int threadId, string reason, int userId)
        {
            return await Task.FromResult(true);
        }

        private int DateToId() => (int)(DateTime.UtcNow.Ticks % 100000);

        private List<ForumThreadDto> GetFallbackThreads(string? category)
        {
            var threads = new List<ForumThreadDto>
            {
                new ForumThreadDto
                {
                    Id = 1,
                    AuthorName = "Marcus Sterling",
                    AvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
                    Title = "Best exercises for 4th and 5th finger independence?",
                    Category = "Technique",
                    Content = "I am struggling with weak 4th finger movement when playing Hanon Ex. 1 at faster tempos. Any recommended stretching or slow practice drills?",
                    Upvotes = 14,
                    RepliesCount = 5,
                    CreatedAt = DateTime.UtcNow.AddHours(-6),
                    IsUpvoted = false
                },
                new ForumThreadDto
                {
                    Id = 2,
                    AuthorName = "Elena Rostova",
                    AvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                    Title = "Chopin Nocturne Op. 9 No. 2 - Rubato Advice",
                    Category = "Repertoire",
                    Content = "How do you balance steady left-hand accompaniment rhythm with expressive right-hand rubato phrasing?",
                    Upvotes = 22,
                    RepliesCount = 8,
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    IsUpvoted = true
                },
                new ForumThreadDto
                {
                    Id = 3,
                    AuthorName = "David Miller",
                    AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                    Title = "Yamaha P-125 vs Roland FP-30X for home practice?",
                    Category = "Equipment",
                    Content = "Looking to upgrade from a synth-action keyboard to a weighted 88-key digital piano under $800.",
                    Upvotes = 9,
                    RepliesCount = 3,
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    IsUpvoted = false
                }
            };

            if (!string.IsNullOrEmpty(category) && category != "All")
            {
                return threads.Where(t => t.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            return threads;
        }
    }
}
