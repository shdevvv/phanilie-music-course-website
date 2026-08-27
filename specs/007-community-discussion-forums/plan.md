# Implementation Plan: Community Discussion Forums

**Branch**: `007-community-discussion-forums` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/007-community-discussion-forums/spec.md)

**Input**: Feature specification from `/specs/007-community-discussion-forums/spec.md`

## Summary

Implement community discussion forum hub (`/forums`), category channel tabs (`Technique`, `Repertoire`, `Equipment`, `General`), new thread creation modal, thread reply feed, post upvoting, and moderation reporting modal.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, EF Core  
**Storage**: Database (PostgreSQL/SQL Server) for `ForumThread`, `ForumReply`, `ForumReport` entities  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), `dotnet build` / `dotnet test` for API  
**Target Platform**: Web (Desktop & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: <50ms channel filter response, <100ms thread creation  
**Constraints**: Non-empty title/content validation, single upvote per user  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `ForumController`, `IForumService`, `ForumThreadCard`, `CreateThreadModal`, and `ReportThreadModal`.
- [x] **Loose Coupling & Interfaces**: `IForumService` encapsulates thread retrieval, posting, and upvoting.
- [x] **Code Quality & SOLID**: Open for future rich-text formatting and media attachments.
- [x] **Testing Standards**: API contract tests for `/api/forum/threads` endpoints.
- [x] **UX & Frontend Integration**: Integrates directly into `forums.tsx` maintaining warm rose design aesthetics.
- [x] **Performance & Optimization**: Client-side cached channel state and fast response payload.

## Project Structure

### Documentation (this feature)

```text
specs/007-community-discussion-forums/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── forum-api.md     # GET & POST /api/forum/threads specs
```

### Source Code

```text
backend/
├── Controllers/
│   └── ForumController.cs
├── Services/
│   ├── IForumService.cs
│   └── ForumService.cs
└── Models/
    ├── ForumThread.cs
    └── ForumThreadDto.cs

frontend/
├── src/
│   ├── forums.tsx
│   ├── components/
│   │   ├── ForumThreadCard.tsx
│   │   ├── CreateThreadModal.tsx
│   │   └── ReportThreadModal.tsx
│   └── services/
│       └── forumApi.ts
```

**Structure Decision**: Fullstack Web Application split between C# .NET Web API and React 19 Frontend.

## Complexity Tracking

*No violations of project constitution detected.*
