# Research: Media File Storage

**Feature Branch**: `013-media-file-storage`  
**Date**: 2026-08-11  
**Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/013-media-file-storage/spec.md)

---

## Technical Context & Decisions

### 1. Storage Strategy Abstraction (`IStorageService`)

- **Decision**: Define a clean `IStorageService` interface in the backend (`backend/Services/IStorageService.cs`) with concrete implementations `LocalStorageService` and `CloudStorageService`.
- **Rationale**: Complies with Constitution Principle II (Loose Coupling & Interface-Driven Design). Allows switching between local disk storage for offline/dev environments and Cloud Storage for production deployments via `appsettings.json` configuration (`"StorageProvider": "Local"` or `"Cloud"`).
- **Alternatives Considered**: Direct Cloud SDK dependency inside controllers (rejected due to high coupling and inability to test offline without internet connection).

---

### 2. Magic-Byte MIME Validation & Header Inspection

- **Decision**: Implement binary header inspection (magic bytes) alongside extension whitelist validation in `backend/Services/MediaValidationService.cs`.
- **Magic Byte Rules**:
  - **PDF**: `%PDF-` (`0x25, 0x50, 0x44, 0x46, 0x2D`)
  - **MP3**: `ID3` (`0x49, 0x44, 0x33`) or sync frame header (`0xFF, 0xFB` / `0xFF, 0xF3`)
  - **PNG**: `0x89, 0x50, 0x4E, 0x47`
  - **JPEG**: `0xFF, 0xD8, 0xFF`
  - **WebP**: `RIFF` header + `WEBP` subtype (`0x52, 0x49, 0x46, 0x46` ... `0x57, 0x45, 0x42, 0x50`)
  - **MP4**: `ftyp` header (`0x66, 0x74, 0x79, 0x70`) at offset 4.
- **Rationale**: Prevents executable spoofing attacks (e.g. renaming `.exe` or `.sh` to `.pdf`).
- **Alternatives Considered**: Relying solely on `file.ContentType` header provided by browser (rejected because MIME headers sent by browsers are trivially spoofed).

---

### 3. Protected Asset Streaming & Short-Lived Signed Access Tokens

- **Decision**: Use HMAC-SHA256 URL token signing (`backend/Services/MediaTokenService.cs`) for protected sheet music PDFs and subscriber lesson MP4 videos.
- **Token Format & Expiration**:
  - Token payload contains `FileId`, `UserId`, and `ExpiresAt` (5-minute expiration window).
  - Endpoint: `GET /api/media/stream/{fileId}?token={token}`
  - Endpoint validates HMAC signature and expiration, then streams the file content with `Accept-Ranges: bytes` support for video seekability and PDF streaming.
- **Rationale**: Meets SC-002 (0% exposure of raw storage paths) and SC-003 (5-minute expiration contract) with zero database overhead on stream/seek requests.
- **Alternatives Considered**: Returning raw direct static URLs to storage buckets (rejected because static links can be shared publicly or hotlinked).

---

### 4. Drag-and-Drop Uploader UI & Real-Time Upload Progress

- **Decision**: Build `MediaUploader.tsx` in `frontend/src/components/MediaUploader.tsx` using HTML5 Drag-and-Drop events and Axios `onUploadProgress` callbacks.
- **Features**: Real-time progress percentage bar updated at least once per second, file size limit validation feedback, file type icons, and preview player (for audio/image).
- **Rationale**: Fulfills FR-013-5 and SC-004.
- **Alternatives Considered**: Un-monitored file uploader without progress feedback (rejected due to poor UX for large video uploads up to 200MB).

---

### 5. Orphaned File Background Cleanup Task

- **Decision**: Implement an ASP.NET Core `BackgroundService` (`backend/Services/OrphanedMediaCleanupService.cs`) scheduled to execute every 6 hours (pruning records where `AttachedToEntityId == null` and `CreatedAt < DateTime.UtcNow.AddHours(-24)`).
- **Rationale**: Keeps local storage and cloud storage clean from unattached temporary file uploads without blocking main API requests.
