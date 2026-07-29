# Technical Implementation Plan: SPEC-002 Freemium Course Exploration & Paywall Guard

**Module Directory**: `docs/specs/002-freemium-course-exploration`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices

* **Backend**: ASP.NET Core 10 Web API (`CoursesController.cs`).
* **Security Middleware**: Custom `PaywallAuthorizationGuard.cs` middleware.
* **Authentication**: JWT Bearer token claims (`Role = Subscriber` or `Role = Admin`).

---

## 2. Codebase Architecture & Folder Structure

```text
backend/
├── Controllers/CoursesController.cs      # Public metadata & protected media endpoints
├── Middleware/
│   └── PaywallAuthorizationGuard.cs     # Custom middleware inspecting subscription status
frontend/
├── src/pages/CoursesPage.jsx            # Interactive course tree navigator
├── src/components/courses/PaywallModal.jsx# Subscription upgrade modal
```

---

## 3. Middleware Security Pipeline

### 3.1 `PaywallAuthorizationGuard.cs` Implementation Logic
```csharp
public class PaywallAuthorizationGuard
{
    private readonly RequestDelegate _next;
    public PaywallAuthorizationGuard(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/lessons/media"))
        {
            var user = context.User;
            var isSubscriber = user.IsInRole("Subscriber") || user.IsInRole("Admin");

            if (!isSubscriber)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new {
                    requires_membership = true,
                    message = "Access to lesson video and sheet music requires an active subscription."
                });
                return;
            }
        }
        await _next(context);
    }
}
```

---

## 4. Implementation Roadmap

1. **Step 1**: Build public metadata endpoints (`GET /api/courses`, `GET /api/courses/{id}`).
2. **Step 2**: Implement `PaywallAuthorizationGuard` middleware.
3. **Step 3**: Build `PaywallModal` UI component in React.
4. **Step 4**: Set up Axios interceptors to open `PaywallModal` upon receiving HTTP `403` status.
