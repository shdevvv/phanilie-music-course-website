using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Models;
using BCrypt.Net;

namespace BackendAPI.Data
{
    public class DbInitializer : IDbInitializer
    {
        private readonly AppDbContext _context;

        public DbInitializer(AppDbContext context)
        {
            _context = context;
        }

        public void Initialize()
        {
            try
            {
                if (_context.Database.IsNpgsql())
                {
                    _context.Database.ExecuteSqlRaw("SELECT pg_advisory_lock(84920412);");
                }

                if (_context.Database.GetPendingMigrations().Any())
                {
                    _context.Database.Migrate();
                }

                SeedSuperAdminUser();
                SeedMembershipPlans();
                SeedAchievementBadges();
                SeedCoursesAndLessons();
                SeedSheetMusics();
            }
            finally
            {
                if (_context.Database.IsNpgsql())
                {
                    try
                    {
                        _context.Database.ExecuteSqlRaw("SELECT pg_advisory_unlock(84920412);");
                    }
                    catch
                    {
                        // Ignore unlock errors during teardown
                    }
                }
            }
        }

        private void SeedSuperAdminUser()
        {
            if (!_context.Users.Any(u => u.Email == "admin@phanilie.com"))
            {
                var adminUser = new User
                {
                    Name = "Phanilie Super Admin",
                    Email = "admin@phanilie.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@Phanilie2026!"),
                    Role = "Admin",
                    CountryCode = "ID",
                    Currency = "IDR",
                    IsSubscribed = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(adminUser);
                _context.SaveChanges();
            }
        }

        private void SeedMembershipPlans()
        {
            if (!_context.MembershipPlans.Any())
            {
                _context.MembershipPlans.AddRange(
                    new MembershipPlan
                    {
                        Name = "Monthly Plan",
                        Description = "1 Month Full Access to Gospel & Jazz piano curriculum and sheet music downloads",
                        DurationDays = 30,
                        PriceIDR = 149000,
                        PriceUSD = 9.99m,
                        IsActive = true
                    },
                    new MembershipPlan
                    {
                        Name = "Quarterly Plan",
                        Description = "3 Months Full Access with 15% discount on all masterclass sessions",
                        DurationDays = 90,
                        PriceIDR = 399000,
                        PriceUSD = 26.99m,
                        IsActive = true
                    },
                    new MembershipPlan
                    {
                        Name = "Annual Plan",
                        Description = "12 Months Full Access (Best Value - Save 30%) with exclusive PDF score downloads",
                        DurationDays = 365,
                        PriceIDR = 1299000,
                        PriceUSD = 89.99m,
                        IsActive = true
                    }
                );
                _context.SaveChanges();
            }
        }

        private void SeedAchievementBadges()
        {
            if (!_context.Badges.Any())
            {
                _context.Badges.AddRange(
                    new Badge
                    {
                        Name = "First Song Mastered",
                        Description = "Completed your very first piano arrangement lesson",
                        IconUrl = "/badges/first-song.png",
                        RequirementType = "LessonCount",
                        RequirementValue = 1
                    },
                    new Badge
                    {
                        Name = "Dedicated Learner",
                        Description = "Completed 5 comprehensive video lessons in the academy",
                        IconUrl = "/badges/dedicated-learner.png",
                        RequirementType = "LessonCount",
                        RequirementValue = 5
                    },
                    new Badge
                    {
                        Name = "Practice Enthusiast",
                        Description = "Logged over 120 minutes of total piano practice time",
                        IconUrl = "/badges/practice-enthusiast.png",
                        RequirementType = "PracticeMinutes",
                        RequirementValue = 120
                    },
                    new Badge
                    {
                        Name = "Weekly Warrior",
                        Description = "Logged practice sessions for 7 consecutive days",
                        IconUrl = "/badges/weekly-warrior.png",
                        RequirementType = "Streak",
                        RequirementValue = 7
                    }
                );
                _context.SaveChanges();
            }
        }

        private void SeedCoursesAndLessons()
        {
            if (!_context.Courses.Any())
            {
                var level1 = new Course
                {
                    Title = "Level 1 - Piano Foundations",
                    Description = "Master seating posture, finger independence, basic notation, and beginner songs",
                    Level = "Beginner",
                    DisplayOrder = 1,
                    ThumbnailUrl = "/coversheets/sheet1.png",
                    Topics = new List<Topic>
                    {
                        new Topic
                        {
                            Title = "Piano Basics & Posture",
                            DisplayOrder = 1,
                            Lessons = new List<Lesson>
                            {
                                new Lesson { Title = "Introduction to the Piano & Orientation", DisplayOrder = 1, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = true },
                                new Lesson { Title = "White & Black Key Note Names", DisplayOrder = 2, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = true },
                                new Lesson { Title = "Proper Sitting Posture & Hand Position", DisplayOrder = 3, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = false }
                            }
                        },
                        new Topic
                        {
                            Title = "Finger Independence & Warm-ups",
                            DisplayOrder = 2,
                            Lessons = new List<Lesson>
                            {
                                new Lesson { Title = "Finger Independence Exercises", DisplayOrder = 1, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = false },
                                new Lesson { Title = "Playing in C Major Position", DisplayOrder = 2, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = false }
                            }
                        }
                    }
                };

                var level2 = new Course
                {
                    Title = "Level 2 - The Complete 12-Key System",
                    Description = "Learn scales, diatonic chords, and chord inversions across all 12 major & minor keys",
                    Level = "Intermediate",
                    DisplayOrder = 2,
                    ThumbnailUrl = "/coversheets/sheet2.png",
                    Topics = new List<Topic>
                    {
                        new Topic
                        {
                            Title = "C Major & A Minor Mastery",
                            DisplayOrder = 1,
                            Lessons = new List<Lesson>
                            {
                                new Lesson { Title = "C Major 2-Octave Scale & Chords", DisplayOrder = 1, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = false },
                                new Lesson { Title = "A Minor Scale & Inversions", DisplayOrder = 2, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = false }
                            }
                        }
                    }
                };

                var level3 = new Course
                {
                    Title = "Level 3 - Gospel & Jazz Harmony",
                    Description = "Master 2-5-1 turnarounds, tritone substitutions, and advanced 9th & 13th voicings",
                    Level = "Advanced",
                    DisplayOrder = 3,
                    ThumbnailUrl = "/coversheets/sheet3.png",
                    Topics = new List<Topic>
                    {
                        new Topic
                        {
                            Title = "Gospel & Jazz Voicings",
                            DisplayOrder = 1,
                            Lessons = new List<Lesson>
                            {
                                new Lesson { Title = "2-5-1 Chord Substitutions in Gospel", DisplayOrder = 1, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = false },
                                new Lesson { Title = "Tritone Substitutions & Inner Voice Leading", DisplayOrder = 2, VideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", IsFreePreview = false }
                            }
                        }
                    }
                };

                _context.Courses.AddRange(level1, level2, level3);
                _context.SaveChanges();
            }
        }

        private void SeedSheetMusics()
        {
            if (!_context.SheetMusics.Any())
            {
                _context.SheetMusics.AddRange(
                    new SheetMusic
                    {
                        Title = "Mercy in the Keys",
                        Composer = "Stephanie Halim",
                        Difficulty = "Intermediate",
                        PriceIDR = 79000,
                        PriceUSD = 5.00m,
                        CoverImageUrl = "/coversheets/sheet1.png",
                        AudioPreviewUrl = "/audio/sample1.mp3"
                    },
                    new SheetMusic
                    {
                        Title = "Soulful Progression Vol. 1",
                        Composer = "Stephanie Halim",
                        Difficulty = "Advanced",
                        PriceIDR = 79000,
                        PriceUSD = 5.00m,
                        CoverImageUrl = "/coversheets/sheet2.png",
                        AudioPreviewUrl = "/audio/sample2.mp3"
                    },
                    new SheetMusic
                    {
                        Title = "Fly Me to the Moon (Jazz Piano Sheet)",
                        Composer = "Bart Howard",
                        Difficulty = "Intermediate",
                        PriceIDR = 79000,
                        PriceUSD = 5.00m,
                        CoverImageUrl = "/coversheets/sheet3.png",
                        AudioPreviewUrl = "/audio/sample3.mp3"
                    },
                    new SheetMusic
                    {
                        Title = "O Holy Night (Gospel Crossover Arrangement)",
                        Composer = "Adolphe Adam",
                        Difficulty = "Advanced",
                        PriceIDR = 79000,
                        PriceUSD = 5.00m,
                        CoverImageUrl = "/coversheets/sheet1.png",
                        AudioPreviewUrl = "/audio/sample1.mp3"
                    }
                );
                _context.SaveChanges();
            }
        }
    }
}
