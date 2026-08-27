# API Contracts: Database Infrastructure & Health Check

## 1. System Health Check Endpoint

### GET `/health`

Verifies backend service operational state and database connection health.

#### Response: `200 OK`

```json
{
  "status": "Healthy",
  "timestamp": "2026-07-29T12:00:00Z",
  "database": {
    "connected": true,
    "pendingMigrations": 0
  }
}
```

---

## 2. Super Admin Login Contract

### POST `/api/auth/login`

Validates seeded Super Admin credentials post-initialization.

#### Request Body

```json
{
  "email": "admin@phanilie.com",
  "password": "Admin@Phanilie2026!"
}
```

#### Response: `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "admin@phanilie.com",
    "fullName": "System Administrator",
    "role": "Admin"
  }
}
```
