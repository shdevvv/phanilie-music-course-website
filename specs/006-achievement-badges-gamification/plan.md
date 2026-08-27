# Implementation Plan: Student Achievement Badges & Gamification

**Branch**: `006-achievement-badges-gamification` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/006-achievement-badges-gamification/spec.md)

**Input**: Feature specification from `/specs/006-achievement-badges-gamification/spec.md`

## Summary

Implement system achievement badges engine ("First Song Mastered", "Dedicated Learner", "Practice Enthusiast", "Weekly Warrior"), animated badge unlock celebration popup modal, dashboard badge showcase grid with progress bars, and idempotent backend badge evaluation API (`/api/badges`).

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, EF Core  
**Storage**: Database (PostgreSQL/SQL Server) for `Badge` & `UserBadge` entities  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), `dotnet build` / `dotnet test` for API  
**Target Platform**: Web (Desktop & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: <100ms celebration modal trigger, 0% duplicate badge records  
**Constraints**: Idempotent unlock evaluation, clear progress bars for locked badges  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `BadgeController`, `IBadgeService`, `BadgeShowcaseWidget`, and `BadgeCelebrationModal`.
- [x] **Loose Coupling & Interfaces**: `IBadgeService` encapsulates badge criteria evaluation logic.
- [x] **Code Quality & SOLID**: Extensible for adding new achievement types without modifying core evaluator.
- [x] **Testing Standards**: API contract tests for `/api/badges/user` and `/api/badges/evaluate`.
- [x] **UX & Frontend Integration**: Integrates directly into `dashboard.tsx` maintaining warm rose design aesthetics.
- [x] **Performance & Optimization**: Immediate client-side celebration popup and indexed `UserBadge` queries.

## Project Structure

### Documentation (this feature)

```text
specs/006-achievement-badges-gamification/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── badge-api.md     # GET & POST /api/badges specs
```

### Source Code

```text
backend/
├── Controllers/
│   └── BadgeController.cs
├── Services/
│   ├── IBadgeService.cs
│   └── BadgeService.cs
└── Models/
    ├── Badge.cs
    └── UserBadgeDto.cs

frontend/
├── src/
│   ├── dashboard.tsx
│   ├── components/
│   │   ├── BadgeShowcaseWidget.tsx
│   │   └── BadgeCelebrationModal.tsx
│   └── services/
│       └── badgeApi.ts
```

**Structure Decision**: Fullstack Web Application split between C# .NET Web API and React 19 Frontend.

## Complexity Tracking

*No violations of project constitution detected.*
