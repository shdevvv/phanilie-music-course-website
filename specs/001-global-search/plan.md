# Implementation Plan: Global Navbar Search

**Branch**: `001-global-search` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/001-global-search/spec.md)

**Input**: Feature specification from `/specs/001-global-search/spec.md`

## Summary

Implement instant, debounced global navbar search across three catalog categories (`Lessons`, `Performance Covers`, and `Sheet Music`). Includes keyboard navigation (`ArrowUp`/`ArrowDown`/`Enter`/`Escape`), minimum 2-character query validation, local storage recent search history, mobile overlay modal responsiveness, and a high-performance backend API endpoint.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, Material Symbols / Lucide React, EF Core  
**Storage**: Database (PostgreSQL/SQL Server) for catalog items + Browser `localStorage` for Recent Searches  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), xUnit / `dotnet test` for backend API  
**Target Platform**: Web (Desktop Chrome/Safari/Firefox & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: <200ms p95 backend search query API latency, 300ms debounced keystroke execution  
**Constraints**: Minimum query length >= 2 chars, max 20 items per category group, debounced execution  
**Scale/Scope**: 3 main catalog domain entities, 1 API search endpoint, 1 top navigation overlay component  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `SearchController` on backend and standalone `GlobalSearchInput` & `SearchDropdown` React components on frontend.
- [x] **Loose Coupling & Interfaces**: Controller delegates search querying to `ISearchService` strategy interface; frontend uses typed DTO props.
- [x] **Code Quality & SOLID**: Open for new catalog categories via strategy pattern without modifying existing search handlers.
- [x] **Testing Standards**: API contract tests for `GET /api/search` and component boundary tests defined.
- [x] **UX & Frontend Integration**: Integrates directly into existing top navigation bar (`layout.tsx`) preserving warmth and aesthetic standards.
- [x] **Performance & Optimization**: 300ms debouncing, minimum 2-char query guard, database ILIKE indexing, and 20-item category caps ensure sub-200ms API responses.

## Project Structure

### Documentation (this feature)

```text
specs/001-global-search/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── search-api.md    # GET /api/search spec
```

### Source Code

```text
backend/
├── Controllers/
│   └── SearchController.cs
├── Services/
│   ├── ISearchService.cs
│   └── SearchService.cs
└── Models/
    └── SearchResponseDto.cs

frontend/
├── src/
│   ├── components/
│   │   ├── GlobalSearchInput.tsx
│   │   └── SearchDropdownOverlay.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useRecentSearches.ts
│   └── services/
│       └── searchApi.ts
```

**Structure Decision**: Web application layout dividing backend C# .NET API endpoints and frontend React components.

## Complexity Tracking

*No violations of project constitution detected.*
