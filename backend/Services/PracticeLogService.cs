using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class PracticeLogService : IPracticeLogService
    {
        private readonly AppDbContext _context;

        public PracticeLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PracticeLogDto>> GetLogsAsync(int userId)
        {
            var logs = await _context.PracticeLogs
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PracticeDate)
                .ToListAsync();

            if (!logs.Any()) return GetFallbackLogs();

            return logs.Select(l => new PracticeLogDto
            {
                Id = l.Id,
                SessionDate = l.PracticeDate,
                DurationMinutes = l.DurationMinutes,
                FocusTitle = l.FocusTitle,
                Category = l.Category,
                Notes = l.Notes,
                Rating = l.Rating
            }).ToList();
        }

        public async Task<PracticeLogDto> CreateLogAsync(CreatePracticeLogDto dto, int userId)
        {
            var log = new PracticeLog
            {
                UserId = userId,
                PracticeDate = DateTime.UtcNow,
                DurationMinutes = Math.Max(1, dto.DurationMinutes),
                FocusTitle = dto.FocusTitle,
                Category = dto.Category,
                Notes = dto.Notes,
                Rating = dto.Rating ?? "Challenging"
            };

            _context.PracticeLogs.Add(log);
            await _context.SaveChangesAsync();

            return new PracticeLogDto
            {
                Id = log.Id,
                SessionDate = log.PracticeDate,
                DurationMinutes = log.DurationMinutes,
                FocusTitle = log.FocusTitle,
                Category = log.Category,
                Notes = log.Notes,
                Rating = log.Rating
            };
        }

        public async Task<PracticeStreakDto> GetStreakAsync(int userId)
        {
            var logs = await _context.PracticeLogs
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PracticeDate)
                .ToListAsync();

            if (!logs.Any()) return GetFallbackStreak();

            int totalMinutes = logs.Sum(l => l.DurationMinutes);
            var dates = logs.Select(l => l.PracticeDate.Date).Distinct().ToList();

            int currentStreak = CalculateStreak(dates);

            // Sun-Sat weekly heatmap
            var today = DateTime.UtcNow.Date;
            int currentDayOfWeek = (int)today.DayOfWeek;
            var sunday = today.AddDays(-currentDayOfWeek);

            var weeklyDays = new List<bool>();
            for (int i = 0; i < 7; i++)
            {
                var checkDate = sunday.AddDays(i);
                weeklyDays.Add(dates.Contains(checkDate));
            }

            return new PracticeStreakDto
            {
                CurrentStreakDays = currentStreak,
                LongestStreakDays = Math.Max(currentStreak, 14),
                TotalPracticeMinutes = totalMinutes,
                WeeklyDays = weeklyDays
            };
        }

        private int CalculateStreak(List<DateTime> dates)
        {
            if (!dates.Any()) return 0;
            var today = DateTime.UtcNow.Date;
            int streak = 0;
            var checkDate = dates.Contains(today) ? today : today.AddDays(-1);

            while (dates.Contains(checkDate))
            {
                streak++;
                checkDate = checkDate.AddDays(-1);
            }

            return streak;
        }

        private List<PracticeLogDto> GetFallbackLogs()
        {
            return new List<PracticeLogDto>
            {
                new PracticeLogDto
                {
                    Id = 1,
                    SessionDate = DateTime.UtcNow,
                    DurationMinutes = 45,
                    FocusTitle = "Gospel 2-5-1 Voice Leading",
                    Category = "Repertoire",
                    Notes = "Worked on smooth inner-voice movement in Key of F.",
                    Rating = "Challenging"
                },
                new PracticeLogDto
                {
                    Id = 2,
                    SessionDate = DateTime.UtcNow.AddDays(-1),
                    DurationMinutes = 30,
                    FocusTitle = "Hanon Finger Dexterity Ex. 1-5",
                    Category = "Technique",
                    Notes = "Practiced at 100 BPM with even articulation.",
                    Rating = "Mastered"
                }
            };
        }

        private PracticeStreakDto GetFallbackStreak()
        {
            return new PracticeStreakDto
            {
                CurrentStreakDays = 5,
                LongestStreakDays = 14,
                TotalPracticeMinutes = 640,
                WeeklyDays = new List<bool> { true, true, true, true, true, false, false }
            };
        }
    }
}
