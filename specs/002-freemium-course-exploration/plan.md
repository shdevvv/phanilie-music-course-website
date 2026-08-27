# Implementation Plan: Freemium Course Exploration

**Branch**: `002-freemium-course-exploration` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/002-freemium-course-exploration/spec.md)

**Input**: Feature specification from `/specs/002-freemium-course-exploration/spec.md`

## Summary

Implement public course catalog browsing (Levels, Courses, Topics, Lessons) with ASP.NET Core `PaywallGuard` middleware protecting premium video streams and downloadable sheet music PDFs. Integrates frontend `MembershipModalContext` overlay triggering localized dual-currency subscription plans when non-subscribers attempt media access.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, Material Symbols, EF Core, BCrypt  
**Storage**: Database (PostgreSQL/SQL Server) for Course, Topic, Lesson entities  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), `dotnet build` / `dotnet test` for API  
**Target Platform**: Web (Desktop & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: <100ms API response for public course tree retrieval, <50ms Paywall Guard authorization checks  
**Constraints**: Zero free preview videos (100% media requires active paid subscription), auth guard before membership checkout  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `CourseController` and `PaywallGuardMiddleware` on backend; standalone `CourseTreeNav`, `LessonPlayerView`, and `MembershipPlanModal` on frontend.
- [x] **Loose Coupling & Interfaces**: `ICourseService` encapsulates curriculum querying behind interface.
- [x] **Code Quality & SOLID**: Extensible for future media types (audio previews, interactive MIDI) without modifying core paywall middleware.
- [x] **Testing Standards**: API contract tests for `/api/courses` and `/api/lessons/{id}/media`.
- [x] **UX & Frontend Integration**: Integrates into existing `courses.tsx` page preserving established warm rose aesthetics.
- [x] **Performance & Optimization**: `AsNoTracking()` EF Core queries and indexed foreign keys guarantee sub-100ms catalog rendering.

## Project Structure

### Documentation (this feature)

```text
specs/002-freemium-course-exploration/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── course-api.md    # GET /api/courses & /api/lessons/{id}/media specs
```

### Source Code

```text
backend/
├── Controllers/
│   └── CourseController.cs
├── Services/
│   ├── ICourseService.cs
│   └── CourseService.cs
├── Middleware/
│   └── PaywallGuardMiddleware.cs
└── Models/
    ├── Course.cs
    └── CourseTreeDto.cs

frontend/
├── src/
│   ├── components/
│   │   ├── CourseCard.tsx
│   │   ├── CurriculumTree.tsx
│   │   └── MembershipPlanModal.tsx
│   ├── context/
│   │   └── MembershipModalContext.tsx
│   └── services/
│       └── courseApi.ts
```

**Structure Decision**: Fullstack Web Application split between C# .NET Web API and React 19 Frontend.

## Complexity Tracking

*No violations of project constitution detected.*
