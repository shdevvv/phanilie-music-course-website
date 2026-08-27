using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/badges")]
    public class BadgeController : ControllerBase
    {
        private readonly IBadgeService _badgeService;

        public BadgeController(IBadgeService badgeService)
        {
            _badgeService = badgeService;
        }

        [HttpGet("user")]
        public async Task<ActionResult<List<UserBadgeDto>>> GetUserBadges()
        {
            int userId = 1; // Demo user ID
            var badges = await _badgeService.GetUserBadgesAsync(userId);
            return Ok(badges);
        }

        [HttpPost("evaluate")]
        public async Task<ActionResult<BadgeEvaluationResultDto>> EvaluateBadges()
        {
            int userId = 1; // Demo user ID
            var newlyUnlocked = await _badgeService.EvaluateUserBadgesAsync(userId);
            return Ok(new BadgeEvaluationResultDto { NewlyUnlockedBadges = newlyUnlocked });
        }
    }
}
