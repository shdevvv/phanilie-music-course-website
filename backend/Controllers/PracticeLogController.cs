using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/practicelogs")]
    public class PracticeLogController : ControllerBase
    {
        private readonly IPracticeLogService _practiceLogService;

        public PracticeLogController(IPracticeLogService practiceLogService)
        {
            _practiceLogService = practiceLogService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PracticeLogDto>>> GetLogs()
        {
            int userId = 1; // Demo user ID
            var logs = await _practiceLogService.GetLogsAsync(userId);
            return Ok(logs);
        }

        [HttpPost]
        public async Task<ActionResult<PracticeLogDto>> CreateLog([FromBody] CreatePracticeLogDto dto)
        {
            int userId = 1; // Demo user ID
            var log = await _practiceLogService.CreateLogAsync(dto, userId);
            return Ok(log);
        }

        [HttpGet("streak")]
        public async Task<ActionResult<PracticeStreakDto>> GetStreak()
        {
            int userId = 1; // Demo user ID
            var streak = await _practiceLogService.GetStreakAsync(userId);
            return Ok(streak);
        }
    }
}
