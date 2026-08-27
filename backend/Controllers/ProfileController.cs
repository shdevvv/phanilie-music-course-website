using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            int userId = 1; // Demo user ID
            var profile = await _profileService.GetProfileAsync(userId);
            return Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UserProfileDto dto)
        {
            int userId = 1; // Demo user ID
            var updated = await _profileService.UpdateProfileAsync(dto, userId);
            return Ok(updated);
        }

        [HttpGet("subscription")]
        public async Task<ActionResult<SubscriptionOverviewDto>> GetSubscription()
        {
            int userId = 1; // Demo user ID
            var subscription = await _profileService.GetSubscriptionAsync(userId);
            return Ok(subscription);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            int userId = 1; // Demo user ID
            bool success = await _profileService.ChangePasswordAsync(dto, userId);
            if (!success)
            {
                return BadRequest(new { success = false, message = "Invalid password or passwords do not match." });
            }
            return Ok(new { success = true, message = "Password updated successfully." });
        }
    }
}
