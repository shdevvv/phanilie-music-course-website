using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/courses")]
    [Route("api/course")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CourseTreeDto>>> GetPublicCourseTree()
        {
            var courses = await _courseService.GetPublicCourseTreeAsync();
            return Ok(courses);
        }

        [HttpGet("/api/lessons/{id}/media")]
        public async Task<IActionResult> GetLessonMediaAccess(int id)
        {
            // Extract demo user ID from header or default to demo subscriber/guest check
            int userId = 1;
            var media = await _courseService.GetLessonMediaAccessAsync(id, userId);

            if (media == null)
            {
                return StatusCode(403, new
                {
                    status = 403,
                    error = "MembershipRequired",
                    message = "An active subscription is required to stream lesson videos or download PDF scores."
                });
            }

            return Ok(media);
        }
    }
}
