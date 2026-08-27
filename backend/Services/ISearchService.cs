using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface ISearchService
    {
        Task<SearchResponseDto> SearchCatalogAsync(string query, int limit = 20);
    }
}
