# Feature Specification: Media File Storage

**Feature Branch**: `013-media-file-storage`  
**Created**: 2026-08-11  
**Status**: Approved Specification  
**Input**: User description: "docs/specs/013/spec.md"

---

## Clarifications

### Session 2026-08-11
- Q: How should temporary unlinked media uploads be tracked in `StoredMediaFile` so that the 24-hour background cleanup task can reliably identify and prune orphaned files? → A: Add `AttachedToEntityId` and `AttachedToEntityType` columns to `StoredMediaFile` (null values indicate an unlinked temporary upload).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Media File Upload & Validation (Priority: P1)

As an Admin Manager, I want to upload digital media assets (PDF sheet music scores, MP3 audio previews, thumbnail images, and MP4 lesson videos) through a drag-and-drop interface so that files are securely validated and stored with strict format, size, and MIME checks.

**Why this priority**: Essential storage baseline for managing curriculum video lessons, downloadable sheet music scores, and cover media across the platform.

**Independent Test**: Uploading valid media files (e.g. 5MB PDF score, 3MB MP3 preview) succeeds and generates a stored media record; uploading invalid file types (`.exe`, `.sh`) or oversized files is rejected.

**Acceptance Scenarios**:

1. **Given** an admin uploading a valid PDF score (under 20MB), MP3 preview (under 10MB), image (under 5MB), or MP4 video (under 200MB), **When** submitted via the file uploader, **Then** the system validates extension and magic-byte MIME type, generates a unique storage key, and returns the asset metadata.
2. **Given** an attempted upload of an unsupported file type (e.g. `.exe`, `.bat`, `.php`), **When** submitted, **Then** the uploader immediately rejects the file with an explicit error ("Unsupported file format").
3. **Given** a file exceeding maximum allowed byte limits (e.g. 25MB PDF), **When** uploaded, **Then** the system aborts the upload and displays a file size limit warning.

---

### User Story 2 - Transparent Storage Strategy & Provider Switching (Priority: P2)

As a system administrator, I want the media storage service to support both Local Disk Storage and Cloud Storage behind a unified interface so that storage environment configuration can switch transparently without code modification.

**Why this priority**: Supports local development offline testing as well as scalable production deployment to cloud storage buckets.

**Independent Test**: Switching storage configuration between `LocalStorage` and `CloudStorage` routes upload and retrieval calls to the target provider without breaking media access.

**Acceptance Scenarios**:

1. **Given** configuration set to `LocalStorage`, **When** a file is uploaded or requested, **Then** the media asset is written to or served from local disk storage buffers.
2. **Given** configuration set to `CloudStorage`, **When** a file is uploaded or requested, **Then** the media asset is uploaded to or retrieved from Cloud Storage buckets.
3. **Given** an asset request, **When** fetched via the storage service, **Then** the response stream is returned transparently regardless of underlying provider.

---

### User Story 3 - Protected Asset Streaming & Short-Lived Access Tokens (Priority: P3)

As a registered student or subscriber, I want protected media assets (purchased digital PDF scores and premium MP4 lesson videos) served via short-lived signed access streams so that raw static file paths and direct storage bucket URLs are never exposed.

**Why this priority**: Critical digital rights protection preventing unauthorized downloading or link sharing of premium sheet music and course videos.

**Independent Test**: Requesting access to a purchased PDF score generates a 5-minute signed token URL that allows streaming; accessing the URL after 5 minutes returns `403 Forbidden`.

**Acceptance Scenarios**:

1. **Given** an active subscriber requesting access to a protected lesson video or purchased PDF score, **When** authorization is verified, **Then** the system issues a short-lived signed token link (expires in 5 minutes) for streaming.
2. **Given** an unauthenticated request or expired token link, **When** accessed, **Then** the system denies access with a `403 Forbidden` response.
3. **Given** a public asset (e.g. course thumbnail or audio preview), **When** requested, **Then** it is served directly via public static URL.

---

### Edge Cases

- **Magic-Byte MIME Spoofing Guard**: If an executable file is renamed with a `.pdf` extension, magic-byte header inspection detects the discrepancy and aborts the upload.
- **Large Video Chunked Upload**: Uploading large MP4 lesson videos (up to 200MB) displays real-time percentage progress bars and supports chunked stream buffers.
- **Orphaned File Cleanup**: Unlinked temporary upload files that are not attached to a published course or sheet music score within 24 hours are automatically pruned by background cleanup tasks.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-013-1**: System MUST support file uploads for digital scores (PDF), audio previews (MP3), thumbnail images (JPEG, PNG, WebP), and lesson videos (MP4).
- **FR-013-2**: System MUST enforce strict file extension rules, magic-byte MIME header validation, and file size limits (PDF max 20MB, Audio max 10MB, Image max 5MB, Video max 200MB).
- **FR-013-3**: System MUST abstract all file storage and retrieval operations behind a unified strategy interface (`IStorageService`) supporting both Local Disk Storage and Cloud Storage.
- **FR-013-4**: System MUST protect non-public digital assets (purchased PDF scores and subscriber lesson videos) by generating short-lived signed access tokens (5-minute expiration) and streaming buffers without exposing raw file paths.
- **FR-013-5**: System MUST render a drag-and-drop file uploader UI component featuring real-time percentage upload progress bars, file type icons, and image/audio preview player controls.
- **FR-013-6**: System MUST automatically prune unlinked temporary media uploads older than 24 hours via scheduled background cleanup.

### Key Entities

- **StoredMediaFile**: Primary media asset record (FileId, StorageKey, OriginalFileName, FileExtension, MimeType, FileSizeBytes, StorageProvider, IsProtected, AttachedToEntityId, AttachedToEntityType, CreatedAt).
- **SignedAccessToken**: Temporary asset access record (TokenId, FileId, UserId, ExpiresAt, CreatedAt).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of uploaded files undergo extension, magic-byte MIME validation, and size limit checks before disk/cloud write.
- **SC-002**: 0% exposure of raw server static file paths for protected PDF sheet music scores and subscriber lesson videos.
- **SC-003**: Short-lived signed access tokens expire in exactly 5 minutes, returning `403 Forbidden` on expired access.
- **SC-004**: Real-time upload progress updates smoothly at least once per second during large video uploads.

---

## Assumptions

- Public media assets (course thumbnails, audio previews) use public static URLs.
- Protected media assets (full PDF scores, premium lesson videos) require authenticated authorization and signed token links.
- Local storage uses a secure non-web-accessible storage directory outside web root.
