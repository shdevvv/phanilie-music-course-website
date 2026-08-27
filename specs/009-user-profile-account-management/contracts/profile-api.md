# API Contract: User Profile & Account Management

## 1. Get User Profile

`GET /api/user/profile`

Requires Authorization header (`Bearer <token>`).

### Response (200 OK)

```json
{
  "userId": 1,
  "name": "Julian Vance",
  "email": "julian.vance@example.com",
  "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  "bio": "Passionate piano enthusiast working through 12-key jazz harmonies and classical Nocturnes.",
  "skillLevel": "Intermediate",
  "preferredGenres": ["Jazz", "Classical", "Gospel"],
  "createdAt": "2026-01-15T00:00:00Z"
}
```

---

## 2. Update User Profile

`PUT /api/user/profile`

### Request Body

```json
{
  "name": "Julian Vance",
  "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  "bio": "Passionate piano enthusiast working through 12-key jazz harmonies.",
  "skillLevel": "Intermediate",
  "preferredGenres": ["Jazz", "Classical"]
}
```

---

## 3. Change Password

`POST /api/user/change-password`

### Request Body

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecretPassword456",
  "confirmPassword": "newSecretPassword456"
}
```
