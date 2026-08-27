# Data Model: Media File Storage

**Feature Branch**: `013-media-file-storage`  
**Date**: 2026-08-11  
**Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/013-media-file-storage/spec.md)

---

## Database Entities

### 1. `StoredMediaFile`

Primary entity representing uploaded digital media assets (PDF sheet music scores, MP3 previews, thumbnail images, and MP4 lesson videos).

| Field Name | Type | Nullable | Constraints & Description |
|------------|------|----------|---------------------------|
| `Id` | `Guid` | No | Primary Key |
| `StorageKey` | `string` | No | Unique storage file path/key (e.g. `2026/08/abc-123.pdf`) |
| `OriginalFileName` | `string` | No | Original filename provided at upload time |
| `FileExtension` | `string` | No | Lowercase extension (`.pdf`, `.mp3`, `.jpg`, `.png`, `.webp`, `.mp4`) |
| `MimeType` | `string` | No | Validated MIME type (e.g. `application/pdf`, `audio/mpeg`, `video/mp4`) |
| `FileSizeBytes` | `long` | No | File size in bytes |
| `StorageProvider` | `string` | No | `"Local"` or `"Supabase"` |
| `IsProtected` | `bool` | No | `true` for purchased PDF scores and subscriber lesson videos |
| `AttachedToEntityId` | `string` | Yes | Parent entity ID (e.g., Score ID, Course ID). `null` indicates an unlinked temporary upload |
| `AttachedToEntityType` | `string` | Yes | Parent entity type (`"SheetMusic"`, `"CourseLesson"`, `"CourseThumbnail"`). `null` indicates temporary upload |
| `CreatedAt` | `DateTime` | No | UTC timestamp of upload |
| `UpdatedAt` | `DateTime` | No | UTC timestamp of last update |

#### Indices
- `IX_StoredMediaFile_StorageKey` (Unique)
- `IX_StoredMediaFile_Cleanup` (`AttachedToEntityId`, `CreatedAt`) — Optimized for 24-hour background cleanup queries.

---

## Ephemeral Data & Value Objects

### 2. `SignedMediaToken` (Stateless HMAC Token)

Stateless token generated for streaming protected media assets without exposing raw storage file paths.

| Field Name | Type | Description |
|------------|------|-------------|
| `FileId` | `Guid` | Target file identifier |
| `UserId` | `string` | Authenticated user requesting access |
| `ExpiresAt` | `DateTime` | Token expiration timestamp (5 minutes from issue) |
| `Signature` | `string` | HMAC-SHA256 signature generated with backend secret key |

---

## File Validation Rules Matrix

| Media Category | Allowed Extensions | Valid Magic Bytes | Max File Size | Access Policy |
|----------------|-------------------|-------------------|---------------|---------------|
| **PDF Score** | `.pdf` | `0x25 0x50 0x44 0x46 0x2D` (`%PDF-`) | 20 MB | Protected (Requires Signed Token) |
| **Audio Preview** | `.mp3` | `ID3` or `0xFF 0xFB` / `0xFF 0xF3` | 10 MB | Public Static Access |
| **Images** | `.jpg`, `.jpeg`, `.png`, `.webp` | PNG (`0x89 PNG`), JPEG (`0xFF D8 FF`), WebP (`RIFF...WEBP`) | 5 MB | Public Static Access |
| **Lesson Video** | `.mp4` | `ftyp` box header (`0x66 0x74 0x79 0x70`) | 200 MB | Protected (Requires Signed Token) |
