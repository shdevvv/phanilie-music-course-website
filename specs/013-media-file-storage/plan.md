# Implementation Plan: Media File Storage

**Branch**: `013-media-file-storage` | **Date**: 2026-08-11 | **Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/013-media-file-storage/spec.md)

**Input**: Feature specification from `/specs/013-media-file-storage/spec.md`

## Summary

Implement a secure, abstracted media file storage and streaming subsystem for the Phanilie Music Platform. The subsystem supports drag-and-drop uploads for digital sheet music (PDF), audio previews (MP3), thumbnail images (JPEG/PNG/WebP), and lesson videos (MP4) with magic-byte MIME validation, dual storage providers (Local Disk & Supabase Cloud Storage), short-lived HMAC signed streaming tokens for protected media, real-time upload progress UI, and background 24-hour orphaned file cleanup.

## Technical Context

**Language/Version**: C# / .NET 8.0 (Backend), TypeScript / React (Frontend)  
**Primary Dependencies**: ASP.NET Core Web API, Axios, Supabase C# Client / HTTP REST Client  
**Storage**: Entity Framework Core + PostgreSQL (`StoredMediaFile` table) + Local File System / Supabase Storage Buckets  
**Testing**: xUnit / Integration tests for validation & streaming, React testing / frontend build check  
**Target Platform**: Linux/Windows Web App  
**Project Type**: Web Service + Web Application  
**Performance Goals**: Sub-200ms metadata responses, smooth video streaming chunk buffering, real-time 1/sec upload progress updates  
**Constraints**: PDF max 20MB, Audio max 10MB, Image max 5MB, Video max 200MB. Signed token 5-minute expiration  
**Scale/Scope**: ~10k media assets, dual storage environment (Local dev vs Cloud prod)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Media storage logic is encapsulated in `IStorageService`, `MediaValidationService`, `MediaTokenService`, and `OrphanedMediaCleanupService`.
- [x] **Loose Coupling & Interfaces**: Storage operations are abstract behind `IStorageService` strategy pattern allowing zero-code provider switching.
- [x] **Code Quality & SOLID**: Open for extension (adding S3 or Azure Blob providers in future), closed for modification.
- [x] **Testing Standards**: Unit tests for MIME magic-byte validation, token signature expiration, and endpoint status codes (`200 OK`, `400 Bad Request`, `403 Forbidden`).
- [x] **UX & Frontend Integration**: Features `MediaUploader.tsx` with drag-and-drop, progress bar, preview player controls, and graceful error alerts without modifying existing visual themes.
- [x] **Performance & Optimization**: Streaming buffers with Range headers (`Accept-Ranges: bytes`) and short-lived HMAC tokens prevent memory spikes and raw file URL exposure.

## Project Structure

### Documentation (this feature)

```text
specs/013-media-file-storage/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── media-api.md     # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
backend/
├── Controllers/
│   └── MediaController.cs
├── Models/
│   ├── StoredMediaFile.cs
│   └── MediaUploadDto.cs
├── Services/
│   ├── IStorageService.cs
│   ├── LocalStorageService.cs
│   ├── SupabaseStorageService.cs
│   ├── MediaValidationService.cs
│   ├── MediaTokenService.cs
│   └── OrphanedMediaCleanupService.cs
└── Data/
    └── ApplicationDbContext.cs

frontend/
├── src/
│   ├── components/
│   │   ├── MediaUploader.tsx
│   │   └── MediaPreviewPlayer.tsx
│   └── services/
│       └── mediaApi.ts
```

**Structure Decision**: Standard ASP.NET Core Web API backend architecture + React TypeScript frontend component structure.

## Complexity Tracking

> No constitution violations detected. Standard decoupled architecture.
