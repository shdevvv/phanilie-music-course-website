using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet]
        public async Task<ActionResult<SearchResponseDto>> Search([FromQuery] string q, [FromQuery] int limit = 20)
        {
            var trimmed = (q ?? string.Empty).Trim();
            if (trimmed.Length < 2)
            {
                return BadRequest(new { status = 400, error = "Bad Request", message = "Search query must be at least 2 characters long." });
            }

            var result = await _searchService.SearchCatalogAsync(trimmed, limit);
            return Ok(result);
        }
    }
}
