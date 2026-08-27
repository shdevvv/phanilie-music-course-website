using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _db;

        public AdminService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<AdminDashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var totalUsers = await _db.Users.CountAsync();
            var activeSubscribers = await _db.Users.CountAsync(u => u.IsSubscribed);
            var totalSheetMusic = await _db.SheetMusics.IgnoreQueryFilters().CountAsync(s => !s.IsArchived);
            var totalCourses = await _db.Courses.IgnoreQueryFilters().CountAsync(c => !c.IsArchived);
            var pendingInquiries = await _db.ContactMessages.CountAsync(c => !c.IsReplied);

            var orders = await _db.Orders.ToListAsync();
            var totalRevenueIDR = orders.Where(o => o.Currency == "IDR").Sum(o => o.TotalAmount);
            var totalRevenueUSD = orders.Where(o => o.Currency == "USD").Sum(o => o.TotalAmount);

            return new AdminDashboardSummaryDto
            {
                TotalUsers = totalUsers,
                ActiveSubscribers = activeSubscribers,
                TotalSheetMusic = totalSheetMusic,
                TotalCourses = totalCourses,
                TotalRevenueIDR = totalRevenueIDR,
                TotalRevenueUSD = totalRevenueUSD,
                PendingInquiries = pendingInquiries
            };
        }

        public async Task<PagedResultDto<AdminSheetMusicDto>> GetSheetMusicListAsync(PagedRequestDto request)
        {
            var query = _db.SheetMusics.IgnoreQueryFilters().AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                var q = request.Query.ToLower().Trim();
                query = query.Where(s => s.Title.ToLower().Contains(q) || s.Composer.ToLower().Contains(q));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(s => s.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(s => new AdminSheetMusicDto
                {
                    Id = s.Id,
                    Title = s.Title,
                    Composer = s.Composer,
                    Instrument = s.Instrument,
                    Difficulty = s.Difficulty,
                    PriceIDR = s.PriceIDR,
                    PriceUSD = s.PriceUSD,
                    CoverImageUrl = s.CoverImageUrl,
                    AudioPreviewUrl = s.AudioPreviewUrl,
                    PdfFilePath = s.PdfFilePath,
                    IsArchived = s.IsArchived
                })
                .ToListAsync();

            return new PagedResultDto<AdminSheetMusicDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<AdminSheetMusicDto> SaveSheetMusicAsync(AdminSheetMusicDto dto)
        {
            if (dto.Id > 0)
            {
                var existing = await _db.SheetMusics.IgnoreQueryFilters().FirstOrDefaultAsync(s => s.Id == dto.Id);
                if (existing != null)
                {
                    existing.Title = dto.Title;
                    existing.Composer = dto.Composer;
                    existing.Instrument = dto.Instrument;
                    existing.Difficulty = dto.Difficulty;
                    existing.PriceIDR = dto.PriceIDR;
                    existing.PriceUSD = dto.PriceUSD;
                    existing.CoverImageUrl = dto.CoverImageUrl;
                    existing.AudioPreviewUrl = dto.AudioPreviewUrl;
                    existing.PdfFilePath = dto.PdfFilePath;
                    existing.IsArchived = dto.IsArchived;
                    await _db.SaveChangesAsync();
                    return dto;
                }
            }

            var newEntity = new SheetMusic
            {
                Title = dto.Title,
                Composer = dto.Composer,
                Instrument = dto.Instrument,
                Difficulty = dto.Difficulty,
                PriceIDR = dto.PriceIDR,
                PriceUSD = dto.PriceUSD,
                CoverImageUrl = dto.CoverImageUrl,
                AudioPreviewUrl = dto.AudioPreviewUrl,
                PdfFilePath = dto.PdfFilePath,
                IsArchived = false,
                CreatedAt = DateTime.UtcNow
            };
            _db.SheetMusics.Add(newEntity);
            await _db.SaveChangesAsync();
            dto.Id = newEntity.Id;
            return dto;
        }

        public async Task<bool> ArchiveSheetMusicAsync(int id)
        {
            var entity = await _db.SheetMusics.IgnoreQueryFilters().FirstOrDefaultAsync(s => s.Id == id);
            if (entity == null) return false;

            entity.IsArchived = true;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResultDto<AdminCourseDto>> GetCourseListAsync(PagedRequestDto request)
        {
            var query = _db.Courses.IgnoreQueryFilters().AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                var q = request.Query.ToLower().Trim();
                query = query.Where(c => c.Title.ToLower().Contains(q) || c.Description.ToLower().Contains(q));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(c => c.DisplayOrder)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new AdminCourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Level = c.Level,
                    ThumbnailUrl = c.ThumbnailUrl,
                    DisplayOrder = c.DisplayOrder,
                    IsArchived = c.IsArchived,
                    TopicCount = c.Topics.Count,
                    LessonCount = c.Topics.SelectMany(t => t.Lessons).Count()
                })
                .ToListAsync();

            return new PagedResultDto<AdminCourseDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<AdminCourseDto> SaveCourseAsync(AdminCourseDto dto)
        {
            if (dto.Id > 0)
            {
                var existing = await _db.Courses.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == dto.Id);
                if (existing != null)
                {
                    existing.Title = dto.Title;
                    existing.Description = dto.Description;
                    existing.Level = dto.Level;
                    existing.ThumbnailUrl = dto.ThumbnailUrl;
                    existing.DisplayOrder = dto.DisplayOrder;
                    existing.IsArchived = dto.IsArchived;
                    await _db.SaveChangesAsync();
                    return dto;
                }
            }

            var newCourse = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                Level = dto.Level,
                ThumbnailUrl = dto.ThumbnailUrl,
                DisplayOrder = dto.DisplayOrder,
                IsArchived = false
            };
            _db.Courses.Add(newCourse);
            await _db.SaveChangesAsync();
            dto.Id = newCourse.Id;
            return dto;
        }

        public async Task<bool> ArchiveCourseAsync(int id)
        {
            var entity = await _db.Courses.IgnoreQueryFilters().FirstOrDefaultAsync(c => c.Id == id);
            if (entity == null) return false;

            entity.IsArchived = true;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResultDto<AdminOrderAuditDto>> GetOrderAuditListAsync(PagedRequestDto request)
        {
            var query = _db.Orders.Include(o => o.User).AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                var q = request.Query.ToLower().Trim();
                query = query.Where(o => o.OrderNumber.ToLower().Contains(q) || (o.User != null && o.User.Email.ToLower().Contains(q)));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(o => new AdminOrderAuditDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    UserEmail = o.User != null ? o.User.Email : "Guest",
                    ItemTitle = "Order #" + o.OrderNumber,
                    Amount = o.TotalAmount,
                    Currency = o.Currency,
                    Gateway = o.PaymentGateway,
                    TransactionId = o.TransactionId,
                    Status = o.PaymentStatus,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            return new PagedResultDto<AdminOrderAuditDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<PagedResultDto<UserDto>> GetUserListAsync(PagedRequestDto request)
        {
            var query = _db.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                var q = request.Query.ToLower().Trim();
                query = query.Where(u => u.Name.ToLower().Contains(q) || u.Email.ToLower().Contains(q));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    CountryCode = u.CountryCode,
                    Currency = u.Currency,
                    IsSubscribed = u.IsSubscribed
                })
                .ToListAsync();

            return new PagedResultDto<UserDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<bool> UpdateUserRoleAsync(AdminUserRoleUpdateDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);
            if (user == null) return false;

            user.Role = dto.Role;
            user.IsSubscribed = dto.IsSubscribed;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResultDto<AdminInquiryDto>> GetInquiryListAsync(PagedRequestDto request)
        {
            var query = _db.ContactMessages.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                var q = request.Query.ToLower().Trim();
                query = query.Where(c => c.Name.ToLower().Contains(q) || c.Email.ToLower().Contains(q) || c.Subject.ToLower().Contains(q));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new AdminInquiryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Email = c.Email,
                    Subject = c.Subject,
                    Message = c.Message,
                    Status = c.IsReplied ? "Resolved" : "Pending",
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return new PagedResultDto<AdminInquiryDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }

        public async Task<bool> UpdateInquiryStatusAsync(int id, string status, string? notes)
        {
            var inquiry = await _db.ContactMessages.FirstOrDefaultAsync(c => c.Id == id);
            if (inquiry == null) return false;

            inquiry.IsReplied = (status.ToLower() == "resolved");
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
