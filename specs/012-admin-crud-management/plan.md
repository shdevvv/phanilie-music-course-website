# Implementation Plan: SPEC-012 Admin CRUD Management

**Branch**: `012-admin-crud-management` | **Date**: 2026-08-11 | **Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/012-admin-crud-management/spec.md)

**Input**: Feature specification from `specs/012-admin-crud-management/spec.md`

---

## Summary

The **Admin CRUD Management** module provides a role-guarded control panel (`[Authorize(Roles = "Admin")]`) enabling platform managers to perform Full CRUD operations across Courses, Curriculum Levels, Topics, Lessons, Cover Videos, and Sheet Music catalog items. It includes an Orders & Revenue transaction audit desk with Midtrans/Stripe gateway IDs and dual-currency totals (`IDR`/`USD`), Student User Management, and a Support Desk for contact inquiry submissions. All list tables feature server-side pagination (`PagedResultDto`), search filtering, and confirmation modals for destructive operations.

---

## Technical Context

**Language/Version**: C# (.NET 9 ASP.NET Core Web API), TypeScript (React 18, Vite)  
**Primary Dependencies**: EF Core 9, Microsoft.AspNetCore.Authorization, Lucide React Icons, React Router DOM  
**Storage**: SQLite / PostgreSQL (`SheetMusic`, `Courses`, `Orders`, `Users`, `ContactInquiries`)  
**Testing**: xUnit (Backend Authorization & CRUD Integration Tests), Vitest / React Testing Library (Frontend UI)  
**Target Platform**: Modern Web Browsers (Desktop Admin Viewport)  
**Project Type**: Web Application (ASP.NET Core Backend API + React Single Page App)  
**Performance Goals**: Authorization evaluation <50ms; CRUD save <300ms; Table pagination <200ms  
**Constraints**: Hard `Admin` role enforcement, soft-deletion for foreign key protection, server-side pagination  
**Scale/Scope**: 10k+ order audit logs and catalog management  

---

## Constitution Check

*GATE: All checks passed. Compliant with Phanilie Music Platform Constitution v1.0.1.*

- [x] **Single Responsibility & Modular Design**: `AdminController` handles admin HTTP endpoints; `AdminService` encapsulates management business logic; `AdminDashboard` renders admin UI.
- [x] **Loose Coupling & Interfaces**: High-level controllers depend on `IAdminService` interface abstraction.
- [x] **Code Quality & SOLID**: Dedicated DTOs (`AdminSheetMusicDto`, `AdminOrderAuditDto`, `PagedResultDto`) prevent monolithic data leaking.
- [x] **Testing Standards**: xUnit test suite covers `403 Forbidden` role guards, soft-delete archival logic, and paged queries.
- [x] **UX & Frontend Integration**: Dark-mode gold theme styling (`#D4AF37`) with sidebar navigation, data tables, and confirmation modals.
- [x] **Performance & Optimization**: `Skip()` & `Take()` SQL pagination ensures sub-200ms query execution across 10,000+ orders.

---

## Project Structure

### Documentation (this feature)

```text
specs/012-admin-crud-management/
├── plan.md              # Implementation plan
├── research.md          # Phase 0 output (RBAC middleware, pagination, soft-delete pattern)
├── data-model.md        # Phase 1 output (DTO schemas, data contracts)
├── quickstart.md        # Phase 1 output (validation & end-to-end testing scenarios)
├── contracts/           # Phase 1 output
│   └── admin-api.md     # REST API contracts
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
backend/
├── Controllers/
│   └── AdminController.cs            # Role-guarded endpoints (/api/admin/*)
├── Data/
│   └── ApplicationDbContext.cs       # DbSets & Query Filters for IsArchived
├── Models/
│   └── AdminDtos.cs                  # PagedRequestDto, PagedResultDto, AdminSheetMusicDto, AdminOrderAuditDto
└── Services/
    ├── IAdminService.cs              # Admin business logic interface
    └── AdminService.cs               # Full CRUD implementation, soft-delete, and transaction auditing

frontend/src/
├── pages/
│   └── AdminDashboard.tsx            # Main admin dashboard page with sidebar layout
├── components/
│   ├── AdminContentTable.tsx         # Generic paginated data table component
│   ├── SheetMusicFormModal.tsx       # Create/Edit modal form for sheet music
│   ├── CourseFormModal.tsx           # Create/Edit modal form for courses
│   └── DestructiveConfirmModal.tsx   # Confirmation dialog for delete operations
└── services/
    └── adminApi.ts                   # Axios/Fetch API client for /api/admin/*
```

**Structure Decision**: Web application layout integrating into existing `backend/` (.NET Web API) and `frontend/` (React SPA).

---

## Complexity Tracking

> **No violations**. Design strictly adheres to Constitution v1.0.1 principles.
