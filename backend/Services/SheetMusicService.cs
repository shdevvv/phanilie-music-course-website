using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class SheetMusicService : ISheetMusicService
    {
        private readonly AppDbContext _context;

        public SheetMusicService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SheetMusicDto>> GetCatalogAsync(string? difficulty, string? genre, int userId)
        {
            var query = _context.SheetMusics.AsNoTracking().AsQueryable();

            if (!string.IsNullOrEmpty(difficulty) && difficulty != "All")
            {
                query = query.Where(s => s.Difficulty.ToLower() == difficulty.ToLower());
            }

            var scores = await query.ToListAsync();

            if (!scores.Any())
            {
                return GetFallbackCatalog();
            }

            var ownedIds = await _context.UserLibraries
                .Where(ul => ul.UserId == userId)
                .Select(ul => ul.SheetMusicId)
                .ToListAsync();

            return scores.Select(s => new SheetMusicDto
            {
                Id = s.Id,
                Title = s.Title,
                Composer = s.Composer,
                Arranger = "Stephanie Halim",
                Difficulty = s.Difficulty,
                Genre = genre ?? "Gospel",
                KeySignature = "C Major",
                PageCount = 4,
                PriceIDR = s.PriceIDR,
                PriceUSD = s.PriceUSD,
                ThumbnailUrl = string.IsNullOrEmpty(s.CoverImageUrl) ? "/coversheets/sheet1.png" : s.CoverImageUrl,
                IsOwned = ownedIds.Contains(s.Id)
            }).ToList();
        }

        public async Task<bool> UnlockSheetMusicAsync(int sheetMusicId, int userId)
        {
            var exists = await _context.UserLibraries.AnyAsync(ul => ul.UserId == userId && ul.SheetMusicId == sheetMusicId);
            if (!exists)
            {
                _context.UserLibraries.Add(new UserLibrary
                {
                    UserId = userId,
                    SheetMusicId = sheetMusicId,
                    PurchasedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();
            }
            return true;
        }

        private List<SheetMusicDto> GetFallbackCatalog()
        {
            return new List<SheetMusicDto>
            {
                new SheetMusicDto
                {
                    Id = 1,
                    Title = "Amazing Grace (Advanced Gospel Arrangement)",
                    Composer = "John Newton",
                    Arranger = "Stephanie Halim",
                    Difficulty = "Intermediate",
                    Genre = "Gospel",
                    KeySignature = "Ab Major",
                    PageCount = 4,
                    PriceIDR = 49000,
                    PriceUSD = 3.99m,
                    ThumbnailUrl = "/coversheets/sheet1.png",
                    IsOwned = false
                },
                new SheetMusicDto
                {
                    Id = 2,
                    Title = "Fly Me to the Moon (Jazz Lead Sheet & Solo)",
                    Composer = "Bart Howard",
                    Arranger = "Stephanie Halim",
                    Difficulty = "Beginner",
                    Genre = "Jazz",
                    KeySignature = "C Major",
                    PageCount = 3,
                    PriceIDR = 39000,
                    PriceUSD = 2.99m,
                    ThumbnailUrl = "/coversheets/sheet2.png",
                    IsOwned = false
                },
                new SheetMusicDto
                {
                    Id = 3,
                    Title = "Clair de Lune (Romantic Piano Transcription)",
                    Composer = "Claude Debussy",
                    Arranger = "Stephanie Halim",
                    Difficulty = "Advanced",
                    Genre = "Classical",
                    KeySignature = "Db Major",
                    PageCount = 6,
                    PriceIDR = 59000,
                    PriceUSD = 4.99m,
                    ThumbnailUrl = "/coversheets/sheet3.png",
                    IsOwned = true
                }
            };
        }
    }
}
