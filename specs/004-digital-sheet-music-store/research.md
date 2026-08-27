# Research & Technical Decisions: Digital Sheet Music Store & Library

## 1. Catalog Search & Filter Strategy

- **Decision**: Fast EF Core query in `SheetMusicService.cs` with `.Where()` filters on `Difficulty`, `Genre`, and `KeySignature`.
- **Optimization**: `.AsNoTracking()` caching for public store listing (< 50ms response).

## 2. Watermarked Preview & Interactive PDF Viewer Strategy

- **Decision**: Lightweight PDF / Image Canvas Viewer in `frontend/src/components/SheetMusicViewerModal.tsx`.
- **Preview Feature**: Watermark overlay ("PREVIEW - PHANILIE PIANO ACADEMY") on first page view.
- **Full View Controls**: Zoom in/out buttons (50% to 200%), page navigation, and verified PDF download link.

## 3. Library Ownership & Access Control

- **Decision**: Endpoint `GET /api/sheetmusic/{id}/download` inspecting `UserLibrary` ownership or `User.IsSubscribed` status.
- **Access Rule**:
  - Owner or Active Subscriber -> 200 OK with direct download URL.
  - Non-owner & Non-subscriber -> 403 Forbidden.
