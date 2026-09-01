using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/sheetmusic")]
    public class SheetMusicController : ControllerBase
    {
        private readonly ISheetMusicService _sheetMusicService;

        public SheetMusicController(ISheetMusicService sheetMusicService)
        {
            _sheetMusicService = sheetMusicService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SheetMusicDto>>> GetCatalog([FromQuery] string? difficulty, [FromQuery] string? genre)
        {
            int userId = 1; // Demo user ID
            var catalog = await _sheetMusicService.GetCatalogAsync(difficulty, genre, userId);
            return Ok(catalog);
        }

        [HttpPost("{id}/unlock")]
        public async Task<IActionResult> UnlockSheetMusic(int id)
        {
            int userId = 1; // Demo user ID
            await _sheetMusicService.UnlockSheetMusicAsync(id, userId);
            return Ok(new { message = "Sheet music unlocked successfully." });
        }
    }
}
