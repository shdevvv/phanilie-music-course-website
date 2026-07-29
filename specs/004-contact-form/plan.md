# Technical Implementation Plan: SPEC-004 Contact Form

**Module Directory**: `docs/specs/004-contact-form`  
**Status**: Approved Technical Plan  

## 1. Selected Tech Stack & Architecture Choices
* **Backend**: ASP.NET Core 10 Web API (`ContactController.cs`).
* **Rate Limiter**: ASP.NET Core Rate Limiting middleware (`FixedWindowLimiter`).
* **Email Service**: SendGrid API / SMTP Mailer (`IEmailService`).

## 2. Codebase Architecture & Folder Structure
```text
backend/
├── Controllers/ContactController.cs
├── Models/ContactInquiry.cs
├── Services/Implementations/EmailService.cs
```

## 3. System Workflow & Data Flow
1. Client POSTs form data to `/api/contact`.
2. Rate Limiter checks IP window. If exceeded, returns HTTP `429 Too Many Requests`.
3. Valid request persisted in `ContactInquiries` DB table.
4. `IEmailService.SendAutoReplyAsync()` dispatches confirmation email template.

## 4. Implementation Roadmap
1. Create `ContactInquiry` entity and Migration.
2. Build `ContactController` with rate limiting attributes.
3. Integrate SendGrid / SMTP transactional email handler.
4. Build React footer contact form component.
