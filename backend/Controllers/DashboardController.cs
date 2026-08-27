using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            int userId = 1; // Demo user ID
            var summary = await _dashboardService.GetSummaryAsync(userId);
            return Ok(summary);
        }

        [HttpGet("todos")]
        public async Task<ActionResult<List<UserTodoDto>>> GetTodos()
        {
            int userId = 1; // Demo user ID
            var todos = await _dashboardService.GetTodosAsync(userId);
            return Ok(todos);
        }

        [HttpPost("todos")]
        public async Task<ActionResult<UserTodoDto>> CreateTodo([FromBody] CreateTodoDto dto)
        {
            int userId = 1; // Demo user ID
            var todo = await _dashboardService.CreateTodoAsync(dto, userId);
            return Ok(todo);
        }
    }
}
