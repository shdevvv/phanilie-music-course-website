using System.Threading.Tasks;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard/summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var summary = await _adminService.GetDashboardSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("sheet-music")]
        public async Task<IActionResult> GetSheetMusic([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? query = null)
        {
            var result = await _adminService.GetSheetMusicListAsync(new PagedRequestDto { Page = page, PageSize = pageSize, Query = query });
            return Ok(result);
        }

        [HttpPost("sheet-music")]
        public async Task<IActionResult> SaveSheetMusic([FromBody] AdminSheetMusicDto dto)
        {
            var result = await _adminService.SaveSheetMusicAsync(dto);
            return Ok(result);
        }

        [HttpDelete("sheet-music/{id:int}")]
        public async Task<IActionResult> ArchiveSheetMusic(int id)
        {
            var success = await _adminService.ArchiveSheetMusicAsync(id);
            if (!success) return NotFound();
            return Ok(new { success = true, message = "Sheet music archived successfully." });
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? query = null)
        {
            var result = await _adminService.GetCourseListAsync(new PagedRequestDto { Page = page, PageSize = pageSize, Query = query });
            return Ok(result);
        }

        [HttpPost("courses")]
        public async Task<IActionResult> SaveCourse([FromBody] AdminCourseDto dto)
        {
            var result = await _adminService.SaveCourseAsync(dto);
            return Ok(result);
        }

        [HttpDelete("courses/{id:int}")]
        public async Task<IActionResult> ArchiveCourse(int id)
        {
            var success = await _adminService.ArchiveCourseAsync(id);
            if (!success) return NotFound();
            return Ok(new { success = true, message = "Course archived successfully." });
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? query = null)
        {
            var result = await _adminService.GetOrderAuditListAsync(new PagedRequestDto { Page = page, PageSize = pageSize, Query = query });
            return Ok(result);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? query = null)
        {
            var result = await _adminService.GetUserListAsync(new PagedRequestDto { Page = page, PageSize = pageSize, Query = query });
            return Ok(result);
        }

        [HttpPut("users/role")]
        public async Task<IActionResult> UpdateUserRole([FromBody] AdminUserRoleUpdateDto dto)
        {
            var success = await _adminService.UpdateUserRoleAsync(dto);
            if (!success) return NotFound();
            return Ok(new { success = true, message = "User role updated successfully." });
        }

        [HttpGet("inquiries")]
        public async Task<IActionResult> GetInquiries([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? query = null)
        {
            var result = await _adminService.GetInquiryListAsync(new PagedRequestDto { Page = page, PageSize = pageSize, Query = query });
            return Ok(result);
        }

        [HttpPut("inquiries/{id:int}")]
        public async Task<IActionResult> UpdateInquiryStatus(int id, [FromQuery] string status, [FromQuery] string? notes = null)
        {
            var success = await _adminService.UpdateInquiryStatusAsync(id, status, notes);
            if (!success) return NotFound();
            return Ok(new { success = true, message = "Inquiry status updated successfully." });
        }
    }
}
