using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class BadgeService : IBadgeService
    {
        private readonly AppDbContext _context;

        public BadgeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserBadgeDto>> GetUserBadgesAsync(int userId)
        {
            var allBadges = await _context.Badges.AsNoTracking().ToListAsync();
            if (!allBadges.Any()) return GetFallbackBadges();

            var unlockedMap = await _context.UserBadges
                .AsNoTracking()
                .Where(ub => ub.UserId == userId)
                .ToDictionaryAsync(ub => ub.BadgeId, ub => ub.UnlockedAt);

            int completedLessons = await _context.UserProgresses.CountAsync(up => up.UserId == userId && up.IsCompleted);
            int practiceMins = await _context.PracticeLogs.Where(p => p.UserId == userId).SumAsync(p => p.DurationMinutes);
            int currentStreak = 5; // Demo streak

            return allBadges.Select(b =>
            {
                bool isUnlocked = unlockedMap.ContainsKey(b.Id);
                DateTime? unlockedAt = isUnlocked ? unlockedMap[b.Id] : null;

                int currentValue = b.RequirementType switch
                {
                    "LessonCount" => completedLessons,
                    "PracticeMinutes" => practiceMins,
                    "Streak" => currentStreak,
                    _ => 0
                };

                int progressPct = b.RequirementValue > 0 ? Math.Min(100, (currentValue * 100) / b.RequirementValue) : 100;

                return new UserBadgeDto
                {
                    BadgeId = b.Id,
                    Name = b.Name,
                    Description = b.Description,
                    IconUrl = string.IsNullOrEmpty(b.IconUrl) ? "⭐" : b.IconUrl,
                    IsUnlocked = isUnlocked || currentValue >= b.RequirementValue,
                    UnlockedAt = unlockedAt ?? DateTime.UtcNow,
                    CurrentValue = currentValue,
                    TargetValue = b.RequirementValue,
                    ProgressPercentage = isUnlocked ? 100 : progressPct
                };
            }).ToList();
        }

        public async Task<List<UserBadgeDto>> EvaluateUserBadgesAsync(int userId)
        {
            var badges = await GetUserBadgesAsync(userId);
            var newlyUnlocked = badges.Where(b => b.IsUnlocked && b.UnlockedAt == null).ToList();

            foreach (var badge in newlyUnlocked)
            {
                var exists = await _context.UserBadges.AnyAsync(ub => ub.UserId == userId && ub.BadgeId == badge.BadgeId);
                if (!exists)
                {
                    _context.UserBadges.Add(new UserBadge
                    {
                        UserId = userId,
                        BadgeId = badge.BadgeId,
                        UnlockedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
            return newlyUnlocked;
        }

        private List<UserBadgeDto> GetFallbackBadges()
        {
            return new List<UserBadgeDto>
            {
                new UserBadgeDto
                {
                    BadgeId = 1,
                    Name = "First Song Mastered",
                    Description = "Completed your 1st piano lesson",
                    IconUrl = "🎵",
                    IsUnlocked = true,
                    UnlockedAt = DateTime.UtcNow.AddDays(-5),
                    CurrentValue = 1,
                    TargetValue = 1,
                    ProgressPercentage = 100
                },
                new UserBadgeDto
                {
                    BadgeId = 2,
                    Name = "Dedicated Learner",
                    Description = "Complete 5 piano lessons",
                    IconUrl = "🎓",
                    IsUnlocked = true,
                    UnlockedAt = DateTime.UtcNow.AddDays(-2),
                    CurrentValue = 5,
                    TargetValue = 5,
                    ProgressPercentage = 100
                },
                new UserBadgeDto
                {
                    BadgeId = 3,
                    Name = "Practice Enthusiast",
                    Description = "Log 300+ total practice minutes",
                    IconUrl = "🎹",
                    IsUnlocked = true,
                    UnlockedAt = DateTime.UtcNow,
                    CurrentValue = 640,
                    TargetValue = 300,
                    ProgressPercentage = 100
                },
                new UserBadgeDto
                {
                    BadgeId = 4,
                    Name = "Weekly Warrior",
                    Description = "Maintain a 7-day practice streak",
                    IconUrl = "🔥",
                    IsUnlocked = false,
                    UnlockedAt = null,
                    CurrentValue = 5,
                    TargetValue = 7,
                    ProgressPercentage = 71
                }
            };
        }
    }
}
