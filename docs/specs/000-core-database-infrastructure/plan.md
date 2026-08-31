# Technical Implementation Plan: SPEC-000 Core Database Infrastructure & Initial Data Seeding

**Module Directory**: `docs/specs/000-core-database-infrastructure`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices

* **Framework**: ASP.NET Core 10 Web API (`net10.0`).
* **ORM & Database**: Entity Framework Core 10 (`Npgsql.EntityFrameworkCore.PostgreSQL`).
* **Database Provider**: PostgreSQL on Neon Cloud / Local PostgreSQL fallback.
* **Seeder Service**: `DbInitializer.cs` invoked in `Program.cs`.

---

## 2. Codebase Architecture & Folder Structure

```text
backend/
├── Data/
│   ├── AppDbContext.cs           # Main EF Core DbContext containing all DbSets
│   ├── DbInitializer.cs          # Auto-migration & Data seeding logic
│   └── Migrations/               # EF Core migration history files
├── Models/
│   ├── User.cs                   # User entity with PasswordHash & Role
│   ├── MembershipPlan.cs         # Plan entity with Price_IDR & Price_USD
│   └── UserBadge.cs              # Badge definition entity
```

---

## 3. Detailed Data Models & Seeding Schema

### 3.1 `AppDbContext.cs` Entity Mappings
```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<MembershipPlan> MembershipPlans => Set<MembershipPlan>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
    }
}
```

### 3.2 `DbInitializer.cs` Implementation Logic
1. Obtain `AppDbContext` from IServiceProvider scope.
2. Call `await context.Database.MigrateAsync()`.
3. Check `if (!await context.Users.AnyAsync(u => u.Role == "Admin"))`:
   * Instantiates Super Admin with BCrypt hashed password (`BCrypt.Net.BCrypt.HashPassword("Admin#2026!Phanilie")`).
4. Check `if (!await context.MembershipPlans.AnyAsync())`:
   * Seeds `Monthly`, `Quarterly`, `Annual` plans.
5. Check `if (!await context.Badges.AnyAsync())`:
   * Seeds baseline achievement badge metadata.
6. Call `await context.SaveChangesAsync()`.

---

## 4. Implementation Roadmap & Verification

1. **Step 1**: Create `AppDbContext` and entity configurations.
2. **Step 2**: Add initial EF Core migration (`dotnet ef migrations add InitialCreate`).
3. **Step 3**: Implement `DbInitializer.SeedAsync()`.
4. **Step 4**: Call seeder in `Program.cs` startup pipeline.
5. **Verification**: Run API, verify PostgreSQL tables created, query Super Admin user in DB.
