# Implementation Plan: Core Database Infrastructure & Initial Data Seeding

**Branch**: `000-core-database-infrastructure` | **Date**: 2026-07-29 | **Spec**: [`spec.md`](file:///d:/phanilie-new/specs/000-core-database-infrastructure/spec.md)

**Input**: Feature specification from [`/specs/000-core-database-infrastructure/spec.md`](file:///d:/phanilie-new/specs/000-core-database-infrastructure/spec.md)

## Summary

Implement automatic database schema migrations and initial baseline data seeding for the Phanilie Music Platform backend API. Upon API startup, the system will apply EF Core migrations against PostgreSQL (protected by PostgreSQL advisory locks for concurrent instance safety) and seed a default Super Admin account (`admin@phanilie.com` / `Admin@Phanilie2026!`), baseline membership tiers (`Monthly`, `Quarterly`, `Annual`), and achievement badges (`First Song Mastered`, etc.) idempotently.

## Technical Context

**Language/Version**: C# / .NET 10.0 (`net10.0`)

**Primary Dependencies**: ASP.NET Core Web API, Entity Framework Core 10.0, `Npgsql.EntityFrameworkCore.PostgreSQL` (10.0.2), `BCrypt.Net-Next` (4.0.3)

**Storage**: PostgreSQL relational database

**Testing**: xUnit, `Microsoft.AspNetCore.Mvc.Testing` (`WebApplicationFactory`), EF Core InMemory / Testcontainers PostgreSQL

**Target Platform**: Linux / Windows Server / Containerized Web API

**Project Type**: Web service (backend API)

**Performance Goals**: Migration execution and baseline seeding complete within <3 seconds on API startup

**Constraints**: <200ms API response targets post-startup, non-blocking concurrent startup locking

**Scale/Scope**: Core database initialization supporting system-wide entities (Users, MembershipPlans, Badges)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `DbInitializer` service handles startup migration and data seeding exclusively.
- [x] **Loose Coupling & Interfaces**: `IDbInitializer` contract abstracts database seed execution from `Program.cs`.
- [x] **Code Quality & SOLID**: Open for extension; clean separation between data migration, entity configurations, and initial data definitions.
- [x] **Testing Standards**: Integration test coverage verifies clean startup migration and idempotent secondary startup.
- [x] **UX & Frontend Integration**: Backend API initialization operates transparently without altering frontend application contracts.
- [x] **Performance & Optimization**: Execution time target set to <3s on startup with session advisory locks for safe concurrency.

## Project Structure

### Documentation (this feature)

```text
specs/000-core-database-infrastructure/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data model schema definitions
├── quickstart.md        # Phase 1 end-to-end validation guide
└── contracts/           # Phase 1 interface contracts
    └── initialization-contracts.md
```

### Source Code (repository root)

```text
backend/
├── Controllers/
│   ├── AuthController.cs
│   └── HealthController.cs
├── Data/
│   ├── ApplicationDbContext.cs
│   ├── DbInitializer.cs
│   ├── IDbInitializer.cs
│   └── Migrations/
├── Models/
│   ├── User.cs
│   ├── MembershipPlan.cs
│   └── Badge.cs
└── Program.cs
```

**Structure Decision**: Web application backend structure (`backend/`), placing core EF Core models in `backend/Models/` and initializers/migrations in `backend/Data/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitution violations present.*
