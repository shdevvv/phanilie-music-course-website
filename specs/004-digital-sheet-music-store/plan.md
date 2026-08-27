# Implementation Plan: Digital Sheet Music Store & Library

**Branch**: `004-digital-sheet-music-store` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/004-digital-sheet-music-store/spec.md)

**Input**: Feature specification from `/specs/004-digital-sheet-music-store/spec.md`

## Summary

Implement digital sheet music store catalog browsing, genre & difficulty filtering, watermarked first-page sample PDF previews, a-la-carte purchasing, personal digital library (`/my-library`), and interactive digital PDF score viewer with zoom and page-turn controls.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, EF Core  
**Storage**: Database (PostgreSQL/SQL Server) for `SheetMusic` & `UserLibrary` entities  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), `dotnet build` / `dotnet test` for API  
**Target Platform**: Web (Desktop & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: <50ms catalog filtering response, <500ms PDF score viewer page render  
**Constraints**: Strict 403 Forbidden check for unowned score PDF downloads  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `SheetMusicController`, `ISheetMusicService`, `SheetMusicStore`, `MyLibrary`, and `SheetMusicViewerModal`.
- [x] **Loose Coupling & Interfaces**: `ISheetMusicService` abstracts score querying and ownership verification.
- [x] **Code Quality & SOLID**: Extensible for future score formats (MIDI files, MusicXML).
- [x] **Testing Standards**: API contract tests for `/api/sheetmusic` and `/api/sheetmusic/library`.
- [x] **UX & Frontend Integration**: Integrates directly into `store.tsx` and `library.tsx` maintaining warm rose design aesthetics.
- [x] **Performance & Optimization**: `AsNoTracking()` EF Core queries and client-side canvas zoom controls.

## Project Structure

### Documentation (this feature)

```text
specs/004-digital-sheet-music-store/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── store-api.md     # GET /api/sheetmusic & /api/sheetmusic/library specs
```

### Source Code

```text
backend/
├── Controllers/
│   └── SheetMusicController.cs
├── Services/
│   ├── ISheetMusicService.cs
│   └── SheetMusicService.cs
└── Models/
    ├── SheetMusic.cs
    └── SheetMusicDto.cs

frontend/
├── src/
│   ├── store.tsx
│   ├── library.tsx
│   ├── components/
│   │   ├── SheetMusicCard.tsx
│   │   └── SheetMusicViewerModal.tsx
│   └── services/
│       └── sheetMusicApi.ts
```

**Structure Decision**: Fullstack Web Application split between C# .NET Web API and React 19 Frontend.

## Complexity Tracking

*No violations of project constitution detected.*
