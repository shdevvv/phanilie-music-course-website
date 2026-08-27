# Quickstart Validation Guide: Media File Storage

**Feature Branch**: `013-media-file-storage`  
**Date**: 2026-08-11  
**Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/013-media-file-storage/spec.md) | **API Contract**: [media-api.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/013-media-file-storage/contracts/media-api.md)

---

## Prerequisites & Setup

1. **Backend Environment**: Ensure .NET 8 SDK is installed and database migrations are applied.
2. **Configuration**:
   - Set `"StorageProvider": "Local"` in `backend/appsettings.Development.json` for offline testing.
   - Verify upload root folder exists at `backend/Storage/Local/`.

---

## Scenario 1: Valid PDF Score Upload & Magic-Byte Verification

Validate that a valid PDF score is accepted, inspected for magic bytes (`%PDF-`), and assigned a `StoredMediaFile` record.

### Command / API Call
```bash
curl -X POST "http://localhost:5000/api/media/upload" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -F "file=@sample_score.pdf;type=application/pdf" \
  -F "isProtected=true"
```

### Expected Outcome
- **Status Code**: `200 OK`
- **Response**: Returns JSON containing `id`, `storageKey`, `mimeType: "application/pdf"`, `isProtected: true`, and `attachedToEntityId: null`.

---

## Scenario 2: Rejection of Spoofed / Executable Files

Validate that magic-byte inspection detects an executable file renamed to `.pdf` and rejects it immediately.

### Command / API Call
```bash
curl -X POST "http://localhost:5000/api/media/upload" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -F "file=@malicious_script.exe;type=application/pdf"
```

### Expected Outcome
- **Status Code**: `400 Bad Request`
- **Response**: `{"error": "UNSUPPORTED_FILE_FORMAT", "message": "File format unsupported or MIME magic-byte validation failed."}`

---

## Scenario 3: Signed Token Expiration & Stream Protection

Validate that requesting a protected asset using a signed token streams correctly before 5 minutes and returns `403 Forbidden` after token expiration.

### Step A: Request Signed Access Token
```bash
curl -X GET "http://localhost:5000/api/media/token/<FILE_ID>" \
  -H "Authorization: Bearer <STUDENT_JWT_TOKEN>"
```
- **Expected Outcome**: `200 OK` with `streamUrl` containing a 5-minute signed token.

### Step B: Access Stream URL
```bash
curl -i "http://localhost:5000/api/media/stream/<FILE_ID>?token=<SIGNED_TOKEN>"
```
- **Expected Outcome**: `200 OK` with binary file stream and `Accept-Ranges: bytes` header.

### Step C: Expired Access Attempt (after 5 minutes or invalid token signature)
```bash
curl -i "http://localhost:5000/api/media/stream/<FILE_ID>?token=EXPIRED_OR_TAMPERED_TOKEN"
```
- **Expected Outcome**: `403 Forbidden` (`ACCESS_DENIED`).

---

## Scenario 4: Front-end Build & Drag-and-Drop Progress Check

Validate that the React frontend builds clean and uploader component builds without type errors.

### Command
```bash
cd frontend && npm run build
```

### Expected Outcome
- **Output**: Clean compilation with zero TypeScript errors or broken imports.
