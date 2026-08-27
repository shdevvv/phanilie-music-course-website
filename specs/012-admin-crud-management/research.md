# Research & Design Decisions: Admin CRUD Management

**Module**: `SPEC-012 Admin CRUD Management`  
**Date**: 2026-08-11  
**Status**: Completed Research Phase  

---

## 1. Role-Based Access Control (RBAC) & Middleware Guard

### Question / Problem Statement
How should the system enforce security policies so that `/api/admin/*` endpoints and `/admin` routes are strictly accessible to accounts with the `Admin` role claim?

### Research Findings & Alternatives Evaluated
1. **Frontend-Only Route Guards**:
   - *Pros*: Simple client-side redirects.
   - *Cons*: Highly vulnerable to API scraping; non-admins can bypass UI and call backend endpoints directly.
2. **ASP.NET Core `[Authorize(Roles = "Admin")]` + Policy Middleware (Chosen)**:
   - *Pros*: Middleware evaluates JWT claim `ClaimTypes.Role == "Admin"` before controller invocation. Unauthenticated calls return `401 Unauthorized`; non-admin JWT calls return `403 Forbidden` with `{ "error": "AccessDenied", "message": "Admin privileges required." }`.
   - *Cons*: Requires role claims embedded in JWT access tokens.

### Final Decision & Rationale
**Selected Approach**: ASP.NET Core Role Authorization Policy on `AdminController`.  
**Rationale**: Guarantees zero security bypass and enforces sub-50ms authorization checks at the pipeline level.

---

## 2. Server-Side Data Table Pagination & Query Optimization

### Question / Problem Statement
How can administrative data tables (Order logs, Users, Catalog items, Contact inquiries) render thousands of records without memory degradation?

### Research Findings & Alternatives Evaluated
1. **Client-Side Array Filtering**:
   - *Pros*: Fast filtering after initial load.
   - *Cons*: Initial JSON response for 10k+ orders exceeds 5MB, causing browser rendering lag.
2. **EF Core `Skip()` & `Take()` Server-Side Pagination (Chosen)**:
   - *Pros*: Queries execute with SQL `OFFSET` & `LIMIT`. Returns lightweight `PagedResultDto<T>` payload (20 items per page).
   - *Cons*: Requires `COUNT(*)` query for total page calculations (optimized via indexed primary keys).

### Final Decision & Rationale
**Selected Approach**: Server-side pagination via `PagedRequestDto` (Page, PageSize=20, SearchTerm, SortColumn, SortDescending).  
**Rationale**: Keeps API query execution under 200ms regardless of dataset growth.

---

## 3. Data Deletion Strategy & Foreign Key Integrity

### Question / Problem Statement
What happens when an admin attempts to delete a Sheet Music score or Course that has already been purchased by students?

### Research Findings & Alternatives Evaluated
1. **Cascading Hard Delete**:
   - *Pros*: Completely removes record from database.
   - *Cons*: Catastrophic data corruption — deletes student library access and breaks financial order audit logs.
2. **Soft-Delete / Archival Pattern (`IsArchived`) (Chosen)**:
   - *Pros*: Setting `IsArchived = true` hides the item from student store and catalog listings. Students who previously purchased the item retain library access, and order logs remain intact.
   - *Cons*: Requires `WHERE IsArchived = false` filter on public student catalog queries.

### Final Decision & Rationale
**Selected Approach**: Soft-deletion (`IsArchived = true`) with destructive modal confirmation prompt.  
**Rationale**: Protects student library entitlements and preserves financial accounting integrity.
