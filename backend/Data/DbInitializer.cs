using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Models;
using BCrypt.Net;

namespace BackendAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Auto apply EF Core Migrations if any
            context.Database.Migrate();

            // Seed Default Membership Plans if empty
            if (!context.MembershipPlans.Any())
            {
                context.MembershipPlans.AddRange(
                    new MembershipPlan { Name = "Monthly Plan", Description = "1 Month Unlimited Access to all courses & masterclasses", DurationDays = 30, PriceIDR = 150000, PriceUSD = 15.00m },
                    new MembershipPlan { Name = "Quarterly Plan", Description = "3 Months Unlimited Access with 15% discount", DurationDays = 90, PriceIDR = 380000, PriceUSD = 38.00m },
                    new MembershipPlan { Name = "Annual Plan", Description = "12 Months Unlimited Access (Best Value - 30% Off)", DurationDays = 365, PriceIDR = 1200000, PriceUSD = 120.00m }
                );
                context.SaveChanges();
            }

            // Seed Baseline Badges if empty
            if (!context.Badges.Any())
            {
                context.Badges.AddRange(
                    new Badge { Name = "First Step", Description = "Completed your very first music lesson", IconUrl = "/badges/first-step.png", RequirementType = "LessonCount", RequirementValue = 1 },
                    new Badge { Name = "5 Lessons Mastered", Description = "Completed 5 music lessons", IconUrl = "/badges/5-lessons.png", RequirementType = "LessonCount", RequirementValue = 5 },
                    new Badge { Name = "Dedicated Musician", Description = "Logged over 120 minutes of total practice time", IconUrl = "/badges/practice-120m.png", RequirementType = "PracticeMinutes", RequirementValue = 120 }
                );
                context.SaveChanges();
            }

            // Seed Default Super Admin Account if empty
            if (!context.Users.Any(u => u.Email == "admin@phanilie.com"))
            {
                var adminUser = new User
                {
                    Name = "Phanilie Admin",
                    Email = "admin@phanilie.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = "Admin",
                    CountryCode = "ID",
                    Currency = "IDR",
                    IsSubscribed = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                context.SaveChanges();
            }
        }
    }
}
