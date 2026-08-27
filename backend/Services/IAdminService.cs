using System.Threading.Tasks;
using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface IAdminService
    {
        Task<AdminDashboardSummaryDto> GetDashboardSummaryAsync();

        Task<PagedResultDto<AdminSheetMusicDto>> GetSheetMusicListAsync(PagedRequestDto request);
        Task<AdminSheetMusicDto> SaveSheetMusicAsync(AdminSheetMusicDto dto);
        Task<bool> ArchiveSheetMusicAsync(int id);

        Task<PagedResultDto<AdminCourseDto>> GetCourseListAsync(PagedRequestDto request);
        Task<AdminCourseDto> SaveCourseAsync(AdminCourseDto dto);
        Task<bool> ArchiveCourseAsync(int id);

        Task<PagedResultDto<AdminOrderAuditDto>> GetOrderAuditListAsync(PagedRequestDto request);
        Task<PagedResultDto<UserDto>> GetUserListAsync(PagedRequestDto request);
        Task<bool> UpdateUserRoleAsync(AdminUserRoleUpdateDto dto);

        Task<PagedResultDto<AdminInquiryDto>> GetInquiryListAsync(PagedRequestDto request);
        Task<bool> UpdateInquiryStatusAsync(int id, string status, string? notes);
    }
}
