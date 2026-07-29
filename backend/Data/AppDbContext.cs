using Microsoft.EntityFrameworkCore;
using BackendAPI.Models;

namespace BackendAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Course> Courses => Set<Course>();
        public DbSet<Topic> Topics => Set<Topic>();
        public DbSet<Lesson> Lessons => Set<Lesson>();
        public DbSet<SheetMusic> SheetMusics => Set<SheetMusic>();
        public DbSet<Cover> Covers => Set<Cover>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<UserLibrary> UserLibraries => Set<UserLibrary>();
        public DbSet<UserProgress> UserProgresses => Set<UserProgress>();
        public DbSet<PracticeLog> PracticeLogs => Set<PracticeLog>();
        public DbSet<UserTodo> UserTodos => Set<UserTodo>();
        public DbSet<Badge> Badges => Set<Badge>();
        public DbSet<UserBadge> UserBadges => Set<UserBadge>();
        public DbSet<LiveMasterclass> LiveMasterclasses => Set<LiveMasterclass>();
        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
        public DbSet<NewsletterSubscription> NewsletterSubscriptions => Set<NewsletterSubscription>();
        public DbSet<MembershipPlan> MembershipPlans => Set<MembershipPlan>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<NewsletterSubscription>()
                .HasIndex(n => n.Email)
                .IsUnique();

            modelBuilder.Entity<UserLibrary>()
                .HasIndex(ul => new { ul.UserId, ul.SheetMusicId })
                .IsUnique();

            modelBuilder.Entity<UserProgress>()
                .HasIndex(up => new { up.UserId, up.LessonId })
                .IsUnique();

            modelBuilder.Entity<UserBadge>()
                .HasIndex(ub => new { ub.UserId, ub.BadgeId })
                .IsUnique();
        }
    }
}
