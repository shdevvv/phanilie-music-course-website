# Tasks: Core Database Infrastructure & Initial Data Seeding

**Input**: Design documents from [`/specs/000-core-database-infrastructure/`](file:///d:/phanilie-new/specs/000-core-database-infrastructure)

**Prerequisites**: [`plan.md`](file:///d:/phanilie-new/specs/000-core-database-infrastructure/plan.md), [`spec.md`](file:///d:/phanilie-new/specs/000-core-database-infrastructure/spec.md), [`research.md`](file:///d:/phanilie-new/specs/000-core-database-infrastructure/research.md), [`data-model.md`](file:///d:/phanilie-new/specs/000-core-database-infrastructure/data-model.md), [`contracts/initialization-contracts.md`](file:///d:/phanilie-new/specs/000-core-database-infrastructure/contracts/initialization-contracts.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project configuration and infrastructure setup

- [x] T001 Verify backend project configuration and dependencies in `backend/BackendAPI.csproj`
- [x] T002 Configure database connection string configuration in `backend/appsettings.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core EF Core database context setup that MUST be complete before user story seeding

- [x] T003 Create base EF Core database context in `backend/Data/AppDbContext.cs`
- [x] T004 Define `IDbInitializer` interface contract in `backend/Data/IDbInitializer.cs`

---

## Phase 3: User Story 1 - Automatic Database Migration & Super Admin Seeding (Priority: P1) 🎯 MVP

**Goal**: Automatically apply EF Core migrations with PostgreSQL session advisory locks and seed the baseline Super Admin user (`admin@phanilie.com` / `Admin@Phanilie2026!`).

- [x] T005 [P] [US1] Create User model and UserRole enum in `backend/Models/User.cs`
- [x] T006 [US1] Register Users DbSet and model configurations in `backend/Data/AppDbContext.cs`
- [x] T007 [US1] Implement `DbInitializer` with PostgreSQL advisory locks and migration execution in `backend/Data/DbInitializer.cs`
- [x] T008 [US1] Add Super Admin user seeding logic in `backend/Data/DbInitializer.cs`
- [x] T009 [P] [US1] Create system health check endpoint in `backend/Controllers/HealthController.cs`
- [x] T010 [P] [US1] Create authentication controller endpoint for Super Admin login in `backend/Controllers/AuthController.cs`
- [x] T011 [US1] Register `IDbInitializer` and execute startup migration scope in `backend/Program.cs`

---

## Phase 4: User Story 2 - Default Membership Tier Seeding (Priority: P2)

**Goal**: Seed default `Monthly` (149k IDR / $9.99 USD), `Quarterly` (399k IDR / $26.99 USD), and `Annual` (1.299M IDR / $89.99 USD) membership plans on initialization.

- [x] T012 [P] [US2] Create MembershipPlan entity model in `backend/Models/LearningAndSupportModels.cs`
- [x] T013 [US2] Register MembershipPlans DbSet and decimal precision in `backend/Data/AppDbContext.cs`
- [x] T014 [US2] Add idempotent MembershipPlans seeding logic in `backend/Data/DbInitializer.cs`

---

## Phase 5: User Story 3 - System Achievement Badge Seeding (Priority: P3)

**Goal**: Seed initial system achievement badges (`First Song Mastered`, `Dedicated Learner`, `Practice Enthusiast`, `Weekly Warrior`) on initialization.

- [x] T015 [P] [US3] Create Badge entity model in `backend/Models/LearningAndSupportModels.cs`
- [x] T016 [US3] Register Badges DbSet in `backend/Data/AppDbContext.cs`
- [x] T017 [US3] Add idempotent Achievement Badges seeding logic in `backend/Data/DbInitializer.cs`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: System verification and final validation

- [x] T018 Execute build verification via `dotnet build` in `backend/`
- [x] T019 Execute end-to-end quickstart validation guide in `specs/000-core-database-infrastructure/quickstart.md`
