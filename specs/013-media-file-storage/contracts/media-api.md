# Media Storage API Contract

**Feature Branch**: `013-media-file-storage`  
**Date**: 2026-08-11  
**Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/013-media-file-storage/spec.md)

---

## 1. Upload Media File

Uploads a digital media file with strict magic-byte MIME validation, size check, and storage provider writing.

- **Method**: `POST`
- **URL**: `/api/media/upload`
- **Auth**: Required (`Role: AdminManager` or `SystemAdmin`)
- **Content-Type**: `multipart/form-data`

### Request Parameters (Form Data)
- `file`: Binary file stream (PDF, MP3, JPEG/PNG/WebP, MP4)
- `isProtected`: `boolean` (optional, default: `false`)

### Success Response (`200 OK`)
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "storageKey": "2026/08/3fa85f64-5717-4562-b3fc-2c963f66afa6.pdf",
  "originalFileName": "Chopin_Nocturne_Op9_No2.pdf",
  "fileExtension": ".pdf",
  "mimeType": "application/pdf",
  "fileSizeBytes": 4521980,
  "storageProvider": "Local",
  "isProtected": true,
  "attachedToEntityId": null,
  "attachedToEntityType": null,
  "createdAt": "2026-08-11T16:50:00Z"
}
```

### Error Responses
- **`400 Bad Request`**: Magic-byte discrepancy or unsupported format.
  ```json
  {
    "error": "UNSUPPORTED_FILE_FORMAT",
    "message": "File format unsupported or MIME magic-byte validation failed."
  }
  ```
- **`400 Bad Request`**: File size limit exceeded.
  ```json
  {
    "error": "FILE_SIZE_LIMIT_EXCEEDED",
    "message": "PDF score exceeds maximum allowed limit of 20MB."
  }
  ```

---

## 2. Request Signed Access Token (Protected Assets)

Generates a short-lived signed access token (5-minute expiration) for authorized students/subscribers.

- **Method**: `GET`
- **URL**: `/api/media/token/{fileId}`
- **Auth**: Required (`Student` or `AdminManager`)

### Success Response (`200 OK`)
```json
{
  "fileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "streamUrl": "/api/media/stream/3fa85f64-5717-4562-b3fc-2c963f66afa6?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-08-11T16:55:00Z",
  "validitySeconds": 300
}
```

### Error Responses
- **`403 Forbidden`**: User has not purchased the score or lacks active subscription.
- **`404 Not Found`**: Media asset does not exist.

---

## 3. Stream Media Content

Streams media file content with HTTP Range request support (`Accept-Ranges: bytes`).

- **Method**: `GET`
- **URL**: `/api/media/stream/{fileId}?token={token}`
- **Auth**: Public for un-protected assets; Token query parameter required for protected assets.

### Headers Supported
- `Range`: `bytes=0-1048575` (for video seekability or partial streaming)

### Success Response (`200 OK` or `206 Partial Content`)
- **Headers**:
  - `Content-Type`: `application/pdf`, `video/mp4`, `audio/mpeg`, etc.
  - `Accept-Ranges`: `bytes`
  - `Content-Length`: `1048576`
  - `Content-Range`: `bytes 0-1048575/52428800`

### Error Response
- **`403 Forbidden`**: Token expired or invalid signature.
  ```json
  {
    "error": "ACCESS_DENIED",
    "message": "Signed token is invalid or has expired."
  }
  ```

---

## 4. Attach Media to Parent Entity

Links a temporary upload to an entity (e.g. SheetMusic, CourseLesson), removing it from background 24-hour cleanup.

- **Method**: `POST`
- **URL**: `/api/media/attach`
- **Auth**: Required (`AdminManager`)

### Request Body
```json
{
  "fileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entityId": "score-9988",
  "entityType": "SheetMusic"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Media file successfully attached to SheetMusic score-9988."
}
```
