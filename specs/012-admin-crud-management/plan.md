# Technical Implementation Plan: SPEC-012 Admin CRUD Management

**Module Directory**: `docs/specs/012-admin-crud-management`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices
* **Backend**: ASP.NET Core 10 Web API (`AdminController.cs`).
* **Security**: `[Authorize(Roles = "Admin")]` attribute enforcement.
* **Frontend**: React Admin Dashboard with reusable Data Tables.

## 2. Codebase Architecture & Folder Structure
```text
backend/
├── Controllers/Admin/AdminCoursesController.cs
├── Controllers/Admin/AdminSheetsController.cs
├── Controllers/Admin/AdminOrdersController.cs
frontend/
├── src/pages/admin/AdminDashboardPage.jsx
```

## 3. Implementation Roadmap
1. Build Admin API Controllers with role authorization attributes.
2. Build reusable `DataTable` and `FormModal` in React.
3. Build `AdminDashboardPage` layout.
