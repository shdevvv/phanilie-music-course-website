# Feature Specification: Admin CRUD Management

**Feature Branch**: `012-admin-crud-management`  
**Created**: 2026-08-11  
**Status**: Approved Specification  
**Input**: User description: "docs/specs/012/spec.md"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Authorization & Role Guard (Priority: P1)

As an Admin Manager, I want access to the admin control panel restricted strictly to accounts with the `Admin` role claim so that non-admin students and unauthenticated guests cannot view or modify sensitive platform data or financial logs.

**Why this priority**: Essential security boundary protecting administrative functions, student records, and financial transaction data.

**Independent Test**: Logging in as a regular student (`Student` role) and attempting to open `/admin` or access `/api/admin/*` returns a `403 Forbidden` error; logging in as an `Admin` grants access to the admin control panel.

**Acceptance Scenarios**:

1. **Given** an authenticated user with `Admin` role claim, **When** navigating to `/admin` or calling `/api/admin/*` endpoints, **Then** access is granted and the admin control panel renders.
2. **Given** an authenticated user with `Student` role claim or an unauthenticated visitor, **When** attempting to access `/admin` or any `/api/admin/*` endpoint, **Then** access is blocked with `403 Forbidden` (or `401 Unauthorized`) and redirected to the home page with an error toast.
3. **Given** an active admin session, **When** the JWT token expires, **Then** administrative actions require token re-authentication before proceeding.

---

### User Story 2 - Content & Curriculum CRUD Management (Priority: P2)

As an Admin Manager, I want full CRUD capabilities over Courses, Levels, Topics, Lessons, Cover Videos, and Sheet Music catalog items so that I can create, update, reorder, and publish curriculum content for students.

**Why this priority**: Core operational capability allowing platform managers to manage the educational catalog and sheet music store.

**Independent Test**: Creating a new sheet music score or lesson as an admin persists the entity to the database and displays it instantly in the student catalog.

**Acceptance Scenarios**:

1. **Given** an admin in the Content Management section, **When** they fill out a form to add a new Course or Sheet Music item with dual pricing (`IDR`/`USD`), **Then** the entity is saved and published to the student catalog.
2. **Given** an existing course or sheet music item, **When** an admin updates details (title, difficulty level, cover image, PDF file link), **Then** changes update immediately in the database and frontend views.
3. **Given** an admin deleting an item, **When** they click "Delete", **Then** a confirmation modal prompt appears requiring explicit confirmation before executing the deletion.

---

### User Story 3 - Financial Orders, Users & Support Inquiries Management (Priority: P3)

As an Admin Manager, I want to review order transaction logs, inspect student account details, manage subscribers, and view contact support inquiry messages so that I can manage platform operations and customer support.

**Why this priority**: Operational oversight for revenue tracking, order troubleshooting, user management, and student support.

**Independent Test**: Filtering order logs by status or customer email displays accurate payment gateway transaction IDs (Midtrans/Stripe) and amounts in active currencies (`IDR`/`USD`).

**Acceptance Scenarios**:

1. **Given** an admin viewing the Orders & Revenue tab, **When** inspecting transactions, **Then** a paginated, searchable data table renders with customer email, order ID, gateway transaction ID, payment status (`Settled`, `Pending`, `Failed`), currency, and total amount.
2. **Given** an admin viewing the Support Inquiries tab, **When** reviewing student contact form messages, **Then** they can view message content, update status (`Pending`, `Resolved`), and append staff notes.
3. **Given** an admin on the User Management tab, **When** searching for a student, **Then** their profile details, subscription tier, and order history are displayed.

---

### Edge Cases

- **Foreign Key Dependency Guard**: Attempting to delete a sheet music score or course that has active student purchase records prompts the admin to archive/soft-delete instead of hard-deleting to preserve purchase history.
- **Concurrent Admin Edits**: If two admins edit the same lesson concurrently, optimistic concurrency control alerts the second admin of the update.
- **Pagination Overhead**: Admin data tables enforce server-side pagination (default 20 items per page) to prevent browser memory bloat on large order logs.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-012-1**: System MUST restrict all `/api/admin/*` endpoints and `/admin` routes strictly to authenticated users possessing the `Admin` role claim.
- **FR-012-2**: System MUST provide Full CRUD management capabilities (Create, Read, Update, Delete) for Courses, Curriculum Levels, Topics, Lessons, Cover Videos, and Sheet Music scores.
- **FR-012-3**: System MUST provide an administrative Orders & Revenue dashboard displaying order logs, payment gateway transaction IDs (Midtrans/Stripe), payment statuses, and dual-currency totals (`IDR`/`USD`).
- **FR-012-4**: System MUST support Student User Management, allowing admins to search users, inspect active subscription tiers, and toggle account roles/statuses.
- **FR-012-5**: System MUST provide a Support Desk interface for reviewing, filtering, and marking student contact inquiry messages as resolved.
- **FR-012-6**: System MUST enforce confirmation modal prompts for all destructive actions (e.g. deleting lessons, revoking access).
- **FR-012-7**: System MUST render searchable data tables with server-side pagination, column sorting, and filter controls across all admin management entities.

### Key Entities

- **AdminUser**: Administrative account representation (`User` entity with `Role = "Admin"`).
- **CurriculumContent**: Course, Level, Topic, and Lesson content entities.
- **CatalogSheetMusic**: Sheet music catalog score entity (Title, Composer, Difficulty, PriceIDR, PriceUSD, PDFUrl, PreviewAudioUrl).
- **OrderAudit**: Financial order record (OrderId, UserId, AmountIDR, AmountUSD, PaymentGateway, GatewayTransactionId, Status, PaidAt).
- **ContactInquiry**: Support message entity (InquiryId, Name, Email, Subject, Message, Status, SubmittedAt).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of non-admin access attempts to `/api/admin/*` or `/admin` routes return `403 Forbidden` within 50ms.
- **SC-002**: Content CRUD operations (Create/Update/Delete) complete and update the database within 300ms.
- **SC-003**: Admin data tables render 10,000+ transaction logs with server-side pagination in under 200ms query time.
- **SC-004**: 0% accidental data loss due to mandatory destructive action confirmation prompts.

---

## Assumptions

- Admin accounts are seeded in database initializer or assigned via database administration.
- Hard-deleting sheet music or courses with active purchase/library records is restricted; soft-deletion or archival is performed.
- Order transaction logs are read-only to preserve financial audit trail integrity.
