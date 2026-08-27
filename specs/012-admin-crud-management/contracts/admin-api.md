# API Contract: Admin CRUD Management

**Module**: `SPEC-012 Admin CRUD Management`  
**Base Path**: `/api/admin`  
**Authentication**: Required `Authorization: Bearer <jwt_token>` possessing `ClaimTypes.Role == "Admin"`.

---

## 1. Dashboard Overview

### `GET /api/admin/dashboard/summary`

Retrieves high-level platform performance metrics, revenue totals, user counts, and pending support ticket numbers.

#### Response `200 OK`
```json
{
  "totalRevenueIDR": 45000000.0,
  "totalRevenueUSD": 2980.50,
  "totalStudents": 1240,
  "activeSubscribers": 312,
  "totalOrders": 850,
  "pendingInquiries": 4
}
```

#### Response `403 Forbidden`
```json
{
  "error": "AccessDenied",
  "message": "Admin privileges required."
}
```

---

## 2. Sheet Music Score Management (CRUD)

### `GET /api/admin/sheet-music`
Paged search and filter list of sheet music catalog items.
- Query Parameters: `pageNumber=1`, `pageSize=20`, `searchTerm=Chopin`, `isArchived=false`

#### Response `200 OK`
Returns `PagedResultDto<AdminSheetMusicDto>`.

### `POST /api/admin/sheet-music`
Creates a new sheet music catalog item.

#### Request Body
```json
{
  "title": "Clair de Lune",
  "composer": "Claude Debussy",
  "instrument": "Piano",
  "difficulty": "Intermediate",
  "priceIDR": 120000.0,
  "priceUSD": 7.99,
  "coverImageUrl": "/images/sheets/debussy-clair.png",
  "pdfScoreUrl": "/protected/scores/debussy-clair.pdf",
  "audioPreviewUrl": "/media/audio/debussy-clair.mp3",
  "isPublished": true
}
```

#### Response `201 Created`
Returns created `AdminSheetMusicDto`.

### `PUT /api/admin/sheet-music/{id}`
Updates an existing sheet music item.

### `DELETE /api/admin/sheet-music/{id}`
Soft-deletes (`IsArchived = true`) a sheet music score to preserve purchase logs.

---

## 3. Course & Curriculum Management (CRUD)

### `GET /api/admin/courses`
Paged list of courses.

### `POST /api/admin/courses`
Creates a new course.

### `PUT /api/admin/courses/{id}`
Updates an existing course.

### `DELETE /api/admin/courses/{id}`
Soft-deletes (`IsArchived = true`) a course.

---

## 4. Financial Orders & Revenue Logs

### `GET /api/admin/orders`
Retrieves searchable, paginated transaction audit logs.
- Query Parameters: `pageNumber=1`, `pageSize=20`, `searchTerm=student@example.com`, `status=Settled`, `gateway=Midtrans`

#### Response `200 OK`
Returns `PagedResultDto<AdminOrderAuditDto>`.

---

## 5. Student User Management

### `GET /api/admin/users`
Paged list of registered platform users.

### `PUT /api/admin/users/{userId}/role`
Updates a user's account role (`"Student"` or `"Admin"`).

#### Request Body
```json
{
  "role": "Admin"
}
```

---

## 6. Support Desk Inquiries

### `GET /api/admin/inquiries`
Paged list of student support form messages.

### `PUT /api/admin/inquiries/{inquiryId}`
Updates inquiry status and appends internal staff notes.

#### Request Body
```json
{
  "status": "Resolved",
  "staffNotes": "Refund processed via Midtrans console."
}
```
