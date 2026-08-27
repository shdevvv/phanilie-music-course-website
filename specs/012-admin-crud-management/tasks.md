# Tasks: Admin CRUD Management

**Input**: Design documents from `/specs/012-admin-crud-management/`  
**Prerequisites**: [plan.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/012-admin-crud-management/plan.md), [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/012-admin-crud-management/spec.md), [research.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/012-admin-crud-management/research.md), [data-model.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/012-admin-crud-management/data-model.md), [contracts/admin-api.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/012-admin-crud-management/contracts/admin-api.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic directory structure verification.

- [x] T001 Create feature branch `012-admin-crud-management` and verify specs structure in `specs/012-admin-crud-management/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database entity updates (`IsArchived` soft-delete), DTO contracts (`PagedResultDto`), EF Core query filters, and service abstractions required before implementing user stories.

- [x] T002 [P] Update `SheetMusic` and `Course` entities in `backend/Models/SheetMusic.cs` and `backend/Models/Course.cs` to add `IsArchived` soft-deletion property
- [x] T003 [P] Create admin DTOs (`PagedRequestDto`, `PagedResultDto<T>`, `AdminDashboardSummaryDto`, `AdminSheetMusicDto`, `AdminCourseDto`, `AdminOrderAuditDto`, `AdminInquiryDto`) in `backend/Models/AdminDtos.cs`
- [x] T004 Update `ApplicationDbContext.cs` in `backend/Data/ApplicationDbContext.cs` to add EF Core query filters (`WHERE IsArchived = false` for public queries) and DbSets
- [x] T005 Apply EF Core database migration for `IsArchived` soft-delete fields in `backend/Data/`
- [x] T006 Create `IAdminService` interface contract in `backend/Services/IAdminService.cs`

---

## Phase 3: User Story 1 - Admin Authorization & Role Guard (Priority: P1) 🎯 MVP

- [x] T007 [US1] Create ASP.NET Core `[Authorize(Roles = "Admin")]` role policy guard and base `AdminController` in `backend/Controllers/AdminController.cs`
- [x] T008 [US1] Implement `GET /api/admin/dashboard/summary` endpoint in `backend/Controllers/AdminController.cs`
- [x] T009 [P] [US1] Implement frontend API client `adminApi.ts` with error interceptor for 403 Forbidden handling in `frontend/src/services/adminApi.ts`
- [x] T010 [P] [US1] Implement frontend Admin Route Guard component `AdminRouteGuard.tsx` in `frontend/src/components/AdminRouteGuard.tsx`
- [x] T011 [US1] Create basic Admin Dashboard layout shell `AdminDashboard.tsx` with sidebar navigation in `frontend/src/pages/AdminDashboard.tsx`

---

## Phase 4: User Story 2 - Content & Curriculum CRUD Management (Priority: P2)

- [x] T012 [US2] Implement Sheet Music & Course CRUD methods with soft-deletion in `backend/Services/AdminService.cs`
- [x] T013 [US2] Expose Sheet Music (`GET/POST/PUT/DELETE /api/admin/sheet-music`) and Course (`GET/POST/PUT/DELETE /api/admin/courses`) endpoints in `backend/Controllers/AdminController.cs`
- [x] T014 [P] [US2] Implement generic paginated data table component `AdminContentTable.tsx` in `frontend/src/components/AdminContentTable.tsx`
- [x] T015 [P] [US2] Implement destructive action confirmation modal `DestructiveConfirmModal.tsx` in `frontend/src/components/DestructiveConfirmModal.tsx`
- [x] T016 [US2] Create Sheet Music management form modal `SheetMusicFormModal.tsx` in `frontend/src/components/SheetMusicFormModal.tsx`
- [x] T017 [US2] Create Course & Lesson management form modal `CourseFormModal.tsx` in `frontend/src/components/CourseFormModal.tsx`
- [x] T018 [US2] Integrate Content Management tabs into `AdminDashboard.tsx` in `frontend/src/pages/AdminDashboard.tsx`

---

## Phase 5: User Story 3 - Financial Orders, Users & Support Inquiries Management (Priority: P3)

- [x] T019 [US3] Implement server-side paged query methods for Orders, Users, and Inquiries in `backend/Services/AdminService.cs`
- [x] T020 [US3] Expose Orders (`GET /api/admin/orders`), Users (`GET/PUT /api/admin/users`), and Inquiries (`GET/PUT /api/admin/inquiries`) endpoints in `backend/Controllers/AdminController.cs`
- [x] T021 [P] [US3] Create Orders & Revenue audit tab component in `frontend/src/components/AdminOrdersTab.tsx`
- [x] T022 [P] [US3] Create User Role & Subscription management tab component in `frontend/src/components/AdminUsersTab.tsx`
- [x] T023 [P] [US3] Create Support Desk Inquiry tab component in `frontend/src/components/AdminInquiriesTab.tsx`
- [x] T024 [US3] Connect Orders, Users, and Support Desk tabs into `AdminDashboard.tsx` in `frontend/src/pages/AdminDashboard.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T025 [P] Add backend unit tests for `AdminController` authorization role guards, soft-delete queries, and server-side pagination in `backend/Tests/AdminControllerTests.cs`
- [x] T026 Run end-to-end quickstart validation scenarios per `specs/012-admin-crud-management/quickstart.md`
