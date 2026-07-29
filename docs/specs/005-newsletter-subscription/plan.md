# Technical Implementation Plan: SPEC-005 Newsletter Subscription

**Module Directory**: `docs/specs/005-newsletter-subscription`  
**Status**: Approved Technical Plan  

## 1. Selected Tech Stack & Architecture Choices
* **Backend**: ASP.NET Core 10 Web API (`NewsletterController.cs`).
* **Database**: `NewsletterSubscribers` table with `UnsubscribeToken` GUID column.
* **Frontend**: React footer form & Unsubscribe landing page component.

## 2. Codebase Architecture & Folder Structure
```text
backend/
├── Controllers/NewsletterController.cs
├── Models/NewsletterSubscriber.cs
frontend/
├── src/components/common/NewsletterForm.jsx
├── src/pages/UnsubscribePage.jsx
```

## 3. System Workflow & Data Flow
1. Visitor POSTs email to `/api/newsletter/subscribe`.
2. Controller inserts or updates record with `UnsubscribeToken = Guid.NewGuid()`.
3. Outgoing mailers inject link `https://phanilie.com/unsubscribe?token={token}`.
4. User clicks link -> GET `/api/newsletter/unsubscribe?token={token}` updates `IsActive = false`.

## 4. Implementation Roadmap
1. Create `NewsletterSubscriber` entity.
2. Build `NewsletterController` endpoints.
3. Build React footer form & Unsubscribe page.
