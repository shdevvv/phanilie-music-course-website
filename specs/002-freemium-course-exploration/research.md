# Research & Technical Decisions: Freemium Course Exploration

## 1. Paywall Guard Middleware & Access Control Strategy

- **Decision**: Implement ASP.NET Core ActionFilter `[PaywallGuard]` attribute and middleware in Backend API (`backend/Middleware/PaywallGuardMiddleware.cs`).
- **Rationale**: Isolates media protection logic outside of business controllers per Constitution Principle I (Single Responsibility).
- **Access Rule**:
  - Unauthenticated guests → 401 Unauthorized / 403 Forbidden.
  - Logged-in free students (`IsSubscribed = false`) → 403 Forbidden with `{ "error": "MembershipRequired", "code": 403 }`.
  - Logged-in paid subscribers (`IsSubscribed = true` and `SubscriptionExpiresAt > DateTime.UtcNow`) → 200 OK access granted.

## 2. Public Course Hierarchy Retrieval

- **Decision**: Single public endpoint `GET /api/courses` with EF Core `.Include(c => c.Topics).ThenInclude(t => t.Lessons)` optimized with `.AsNoTracking()`.
- **Rationale**: Public visitors can instantly render the entire curriculum tree in one fast database query (< 100ms).
- **Security Guard**: `VideoUrl` and `PdfUrl` fields are stripped from public catalog response, only exposed via protected `/api/lessons/{id}/media` endpoint.

## 3. Frontend Paywall Overlay & Auth Guard Workflow

- **Decision**: Global React Context / Modal State (`MembershipModalContext.tsx`) listening for 403 API responses.
- **Navigation Flow**:
  - Clicking "Subscribe Now" when unauthenticated → Store target plan & redirect to `/signup` or `/signin`.
  - Clicking "Subscribe Now" when authenticated → Direct transition to `/checkout`.
