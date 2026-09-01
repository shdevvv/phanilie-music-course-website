using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface ISheetMusicService
    {
        Task<List<SheetMusicDto>> GetCatalogAsync(string? difficulty, string? genre, int userId);
        Task<bool> UnlockSheetMusicAsync(int sheetMusicId, int userId);
    }
}
