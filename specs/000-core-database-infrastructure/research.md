# Research: Core Database Infrastructure & Initial Data Seeding

## 1. Automatic Database Migrations on Startup

### Decision
Use an asynchronous database initializer service (`DbInitializer`) executed within a scoped `IServiceProvider` upon ASP.NET Core application startup (`Program.cs`) before handling HTTP requests.

### Rationale
Calling `await dbContext.Database.MigrateAsync()` during startup ensures that all PostgreSQL tables and schemas are created or updated to the latest migration version automatically without requiring external deployment scripts or manual SQL execution.

### Alternatives Considered
- **Manual CLI Migration Execution (`dotnet ef database update`)**: Rejected because it requires separate CI/CD steps and manual execution in developer or staging environments.
- **`Database.EnsureCreatedAsync()`**: Rejected because it bypasses EF Core migration history and prevents future incremental schema migrations.

---

## 2. Safe Concurrent Migration Execution & Advisory Locks

### Decision
Wrap `MigrateAsync()` execution in a PostgreSQL session advisory lock (`pg_advisory_lock(int64)`) using raw SQL commands on the EF Core database connection.

### Rationale
When multiple instances of the backend API launch concurrently in clustered or load-balanced environments, simultaneous schema migrations can cause transaction lock contention or duplicate DDL errors. A PostgreSQL advisory lock ensures strictly serial migration execution across instances.

### Alternatives Considered
- **No Concurrency Lock**: Risk of transaction deadlocks during simultaneous startup.
- **External Initialization Container**: Adds container orchestration complexity for simple startup initialization.

---

## 3. System Super Admin & Reference Data Seeding Strategy

### Decision
Implement an idempotent `DbInitializer.SeedAsync(ApplicationDbContext context)` method that checks for existing data before seeding missing entries:
1. **Super Admin**: Query `Users.AnyAsync(u => u.Role == UserRole.Admin)`. If false, seed `admin@phanilie.com` with role `Admin` and BCrypt-hashed password `Admin@Phanilie2026!`.
2. **Membership Plans**: Query `MembershipPlans.AnyAsync()`. If false, seed `Monthly`, `Quarterly`, and `Annual` plans with dual-currency pricing (`Price_IDR` & `Price_USD`).
3. **Achievement Badges**: Query `Badges.AnyAsync()`. If false, seed default system badges (`First Song Mastered`, `Dedicated Learner`, `Practice Enthusiast`, `Weekly Warrior`).

### Rationale
Using explicit `AnyAsync()` checks prevents duplicate records on subsequent API restarts while ensuring 100% operational baseline data on clean database deployments.

---

## 4. Password Security & Hashing

### Decision
Use `BCrypt.Net-Next` (`BCrypt.Net.BCrypt.HashPassword`) for hashing the seeded Super Admin password (`Admin@Phanilie2026!`).

### Rationale
Aligns with project dependency `BCrypt.Net-Next 4.0.3` already present in `BackendAPI.csproj`.
