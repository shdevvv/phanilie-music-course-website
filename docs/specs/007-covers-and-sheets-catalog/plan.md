# Technical Implementation Plan: SPEC-007 Covers & Sheets Catalog

**Module Directory**: `docs/specs/007-covers-and-sheets-catalog`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices
* **Backend**: ASP.NET Core 10 Web API (`CatalogController.cs`).
* **Audio Player**: HTML5 Audio Web API with custom React waveform controls.
* **Storage**: MP3 audio previews served via byte-range stream endpoints.

## 2. Codebase Architecture & Folder Structure
```text
backend/
├── Controllers/CatalogController.cs
├── Models/SheetMusic.cs
├── Models/CoverVideo.cs
frontend/
├── src/pages/CatalogPage.jsx
├── src/components/common/AudioPreviewPlayer.jsx
```

## 3. Implementation Roadmap
1. Create `SheetMusic` and `CoverVideo` models.
2. Build `CatalogController` filtering endpoints.
3. Build `CatalogPage` and `AudioPreviewPlayer` in React.
