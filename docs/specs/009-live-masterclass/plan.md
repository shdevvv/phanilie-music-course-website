# Technical Implementation Plan: SPEC-009 Live Masterclass

**Module Directory**: `docs/specs/009-live-masterclass`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices
* **Backend**: ASP.NET Core 10 Web API (`MasterclassController.cs`).
* **Security**: `[Authorize(Roles = "Subscriber,Admin")]` role authorization.
* **Frontend**: React Masterclass page with live stream embed.

## 2. Codebase Architecture & Folder Structure
```text
backend/
├── Controllers/MasterclassController.cs
├── Models/MasterclassEvent.cs
frontend/
├── src/pages/MasterclassPage.jsx
```

## 3. Implementation Roadmap
1. Create `MasterclassEvent` entity.
2. Build `MasterclassController` endpoints.
3. Build `MasterclassPage` in React.
