# Implementation Plan: 000 - Core Database Infrastructure & Data Seeding

**Spec**: [spec.md](file:///d:/phanilie-new/specs/000-core-database-infrastructure/spec.md)

## Technical Context
- **Files**: `backend/Data/AppDbContext.cs`, `backend/Data/DbInitializer.cs`, `backend/Program.cs`
- **ORM**: Entity Framework Core 10 (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Seeding**: Super Admin user hash, `Monthly`/`Quarterly`/`Annual` plans (IDR & USD), default badges.
