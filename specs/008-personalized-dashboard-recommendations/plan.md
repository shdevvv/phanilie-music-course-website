# Implementation Plan: Personalized Learning Dashboard & Recommendations

**Branch**: `008-personalized-dashboard-recommendations` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/008-personalized-dashboard-recommendations/spec.md)

**Input**: Feature specification from `/specs/008-personalized-dashboard-recommendations/spec.md`

## Summary

Implement personalized learning progress metrics (overall mastery %, completed lessons, practice time, XP), Next Recommended Lesson widget with direct jump action, interactive Student To-Do checklist widget, and Saved for Later study bookmarks list.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, EF Core  
**Storage**: Database (PostgreSQL/SQL Server) for `UserProgress`, `PracticeLog`, `UserTodo` entities  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), `dotnet build` / `dotnet test` for API  
**Target Platform**: Web (Desktop & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: <50ms metrics update, 100% accurate recommended lesson recommendation  
**Constraints**: Clean empty state handling, persistent To-Do list  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `DashboardController`, `IDashboardService`, `NextRecommendedLessonCard`, and `StudentTodoWidget`.
- [x] **Loose Coupling & Interfaces**: `IDashboardService` encapsulates progress metric calculations and recommendation algorithms.
- [x] **Code Quality & SOLID**: Extensible for future AI recommendation models.
- [x] **Testing Standards**: API contract tests for `/api/dashboard/summary` and `/api/dashboard/todos`.
- [x] **UX & Frontend Integration**: Integrates directly into `dashboard.tsx` maintaining warm rose design aesthetics.
- [x] **Performance & Optimization**: Client-side cached metrics and instant UI updates.

## Project Structure

### Documentation (this feature)

```text
specs/008-personalized-dashboard-recommendations/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── dashboard-api.md # GET & POST /api/dashboard specs
```

### Source Code

```text
backend/
├── Controllers/
│   └── DashboardController.cs
├── Services/
│   ├── IDashboardService.cs
│   └── DashboardService.cs
└── Models/
    └── DashboardSummaryDto.cs

frontend/
├── src/
│   ├── dashboard.tsx
│   ├── components/
│   │   └── NextRecommendedLessonCard.tsx
│   └── services/
│       └── dashboardApi.ts
```

**Structure Decision**: Fullstack Web Application split between C# .NET Web API and React 19 Frontend.

## Complexity Tracking

*No violations of project constitution detected.*
