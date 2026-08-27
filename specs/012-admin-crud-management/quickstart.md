# Quickstart Validation Guide: Admin CRUD Management

**Module**: `SPEC-012 Admin CRUD Management`  
**Date**: 2026-08-11  

---

## 1. Overview & Setup Prerequisites

This quickstart guide validates role-based security access control (`[Authorize(Roles = "Admin")]`), Content CRUD operations across Courses and Sheet Music, Orders & Revenue transaction audit logs, User Management, and Support Desk Inquiries.

### Prerequisites
- Backend API running at `http://localhost:5000` (or `http://localhost:5181`)
- Frontend Dev Server running at `http://localhost:5173`
- Database seeded with an Admin account (`admin@phaniliemusic.com`) and a regular Student account (`student@phaniliemusic.com`)

---

## 2. Test Scenarios & Step-by-Step Verification

### Scenario A: Role Security Guard Verification (`403 Forbidden`)
1. Log into the application as a regular student (`student@phaniliemusic.com`).
2. Navigate directly to `http://localhost:5173/admin` or execute `GET /api/admin/dashboard/summary`.
3. **Expected Outcome**:
   - The backend API denies access returning HTTP `403 Forbidden` (`{ "error": "AccessDenied" }`).
   - The frontend routes the student back to `/` with an error toast notification: *"Access Denied. Admin privileges required."*

---

### Scenario B: Admin Content CRUD Operations (Sheet Music & Courses)
1. Log into the application as an admin manager (`admin@phaniliemusic.com`).
2. Open the Admin Control Panel at `/admin` -> Navigate to **"Sheet Music Management"**.
3. Click **"Add New Sheet Music"**, fill out details (Title: *"Liebestraum No. 3"*, Composer: *"Franz Liszt"*, Price IDR: `135.000`, Price USD: `$8.99`), and click **"Save"**.
4. **Expected Outcome**:
   - The item persists to the database and appears in the admin table.
   - Navigating to `/covers-sheets` in student view shows *"Liebestraum No. 3"* live in the catalog.
5. In Admin panel, click **"Delete"** on the newly created item.
6. **Expected Outcome**:
   - A destructive confirmation modal pops up requiring explicit confirmation.
   - Upon confirmation, the item is soft-deleted (`IsArchived = true`) and hidden from the student catalog while preserving database foreign keys.

---

### Scenario C: Orders Audit Log Search & Server-Side Pagination
1. In Admin panel, click on **"Orders & Revenue"** tab.
2. Enter a search query (e.g. `MID-TRX`) in the transaction search filter.
3. **Expected Outcome**:
   - The API executes server-side pagination via `PagedResultDto<AdminOrderAuditDto>`.
   - Data table displays customer email, payment gateway transaction ID (Midtrans/Stripe), payment status, and dual-currency totals (`IDR`/`USD`).

---

### Scenario D: Support Desk Inquiry Management
1. Click on **"Support Inquiries"** tab.
2. Select an incoming student contact form message, update status to **"Resolved"**, append internal staff notes, and save.
3. **Expected Outcome**:
   - Inquiry status updates to "Resolved" and staff notes persist.

---

## 3. Automated Command Verification

```bash
# Run backend unit tests for AdminController & Role Authorization
dotnet test backend/BackendAPI.csproj --filter "FullyQualifiedName~AdminControllerTests"

# Run frontend component tests for AdminDashboard & DataTables
cd frontend && npm test -- src/pages/AdminDashboard.test.tsx
```
