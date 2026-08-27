# Implementation Plan: Interactive Practice Logger & Streaks

**Branch**: `005-interactive-practice-logger` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/005-interactive-practice-logger/spec.md)

**Input**: Feature specification from `/specs/005-interactive-practice-logger/spec.md`

## Summary

Implement live stopwatch practice tracking, manual session logging, daily practice streak calculator, weekly day-of-week heatmap visualizer (Sun-Sat), and searchable practice history feed on frontend (`/practice-log`) and backend API (`/api/practicelogs`).

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, EF Core  
**Storage**: Database (PostgreSQL/SQL Server) for `PracticeLog` entity & `accomplishmentHelper.ts`  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), `dotnet build` / `dotnet test` for API  
**Target Platform**: Web (Desktop & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: Real-time timer update (100% precision), <200ms streak recalculation  
**Constraints**: Zero 0-minute session saves, 4-hour active timer timeout guard  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `PracticeLogController`, `IPracticeLogService`, `PracticeTimer`, `StreakHeaderWidget`, and `PracticeLogHistory`.
- [x] **Loose Coupling & Interfaces**: `IPracticeLogService` encapsulates streak calculation and log persistence.
- [x] **Code Quality & SOLID**: Extensible for future gamification rewards (badges, leaderboard ranks).
- [x] **Testing Standards**: API contract tests for `/api/practicelogs` and `/api/practicelogs/streak`.
- [x] **UX & Frontend Integration**: Integrates directly into `practiceLog.tsx` and `practiceLogs.tsx` maintaining warm rose design aesthetics.
- [x] **Performance & Optimization**: Lightweight timer hook and client-side cached streak calculator.

## Project Structure

### Documentation (this feature)

```text
specs/005-interactive-practice-logger/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── practice-api.md  # GET & POST /api/practicelogs & streak specs
```

### Source Code

```text
backend/
├── Controllers/
│   └── PracticeLogController.cs
├── Services/
│   ├── IPracticeLogService.cs
│   └── PracticeLogService.cs
└── Models/
    ├── PracticeLog.cs
    └── PracticeLogDto.cs

frontend/
├── src/
│   ├── practiceLog.tsx
│   ├── practiceLogs.tsx
│   ├── hooks/
│   │   └── usePracticeTimer.ts
│   └── services/
│       └── practiceLogApi.ts
```

**Structure Decision**: Fullstack Web Application split between C# .NET Web API and React 19 Frontend.

## Complexity Tracking

*No violations of project constitution detected.*
