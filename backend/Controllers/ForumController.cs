using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/forum/threads")]
    public class ForumController : ControllerBase
    {
        private readonly IForumService _forumService;

        public ForumController(IForumService forumService)
        {
            _forumService = forumService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ForumThreadDto>>> GetThreads([FromQuery] string? category)
        {
            var threads = await _forumService.GetThreadsAsync(category);
            return Ok(threads);
        }

        [HttpPost]
        public async Task<ActionResult<ForumThreadDto>> CreateThread([FromBody] CreateThreadDto dto)
        {
            int userId = 1; // Demo user ID
            var thread = await _forumService.CreateThreadAsync(dto, userId);
            return Ok(thread);
        }

        [HttpPost("{id}/upvote")]
        public async Task<IActionResult> UpvoteThread(int id)
        {
            int userId = 1; // Demo user ID
            await _forumService.UpvoteThreadAsync(id, userId);
            return Ok(new { success = true });
        }

        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportThread(int id, [FromBody] ReportThreadDto dto)
        {
            int userId = 1; // Demo user ID
            await _forumService.ReportThreadAsync(id, dto.Reason, userId);
            return Ok(new { success = true });
        }
    }
}
