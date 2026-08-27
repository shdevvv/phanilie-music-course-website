# API Contract: Auth & Country Localization

**Module**: `SPEC-011 Auth & Country Localization`  
**Base Path**: `/api/auth`  

---

## 1. GeoIP Location Detection

### `GET /api/auth/geoip`

Detects incoming request IP headers (`CF-IPCountry`, `X-Forwarded-For`) to return recommended country code and currency for auto-filling Sign Up form.

#### Response `200 OK`
```json
{
  "countryCode": "ID",
  "countryName": "Indonesia",
  "suggestedCurrency": "IDR"
}
```

---

## 2. User Registration

### `POST /api/auth/signup`

Registers a new user, hashes password with BCrypt (work factor 11), assigns `CountryCode` and `CurrencyClaim` (`IDR` if country code is `ID`, else `USD`), issues 15-min access token, and sets 7-day HTTP-only refresh cookie.

#### Request Body
```json
{
  "fullName": "Stephanie Halim",
  "email": "student@phaniliemusic.com",
  "password": "SecurePassword123!",
  "countryCode": "ID"
}
```

#### Response `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-08-11T14:50:00Z",
  "user": {
    "id": 42,
    "email": "student@phaniliemusic.com",
    "fullName": "Stephanie Halim",
    "role": "Student",
    "countryCode": "ID",
    "currency": "IDR"
  }
}
```
Header: `Set-Cookie: phanilie_refresh_token=<token_guid>; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=604800`

---

## 3. User Authentication (Sign In)

### `POST /api/auth/signin`

Authenticates user credentials, checks brute-force lockout status, creates a database `RefreshToken` session for device, and sets 7-day HTTP-only refresh cookie.

#### Request Body
```json
{
  "email": "student@phaniliemusic.com",
  "password": "SecurePassword123!"
}
```

#### Response `200 OK`
Returns `AuthResponseDto` and sets `phanilie_refresh_token` HTTP-only cookie.

#### Response `429 Too Many Requests` (Lockout)
```json
{
  "error": "AccountLocked",
  "message": "Account temporarily locked due to 5 failed login attempts. Try again in 15 minutes or reset your password.",
  "lockoutEnd": "2026-08-11T14:45:00Z"
}
```

---

## 4. Refresh Token Rotation

### `POST /api/auth/refresh`

Verifies the HTTP-only `phanilie_refresh_token` cookie against `RefreshTokens` database table, rotates the refresh token, and returns a fresh 15-min access token.

#### Cookie Input
`phanilie_refresh_token=<token_guid>`

#### Response `200 OK`
Returns `AuthResponseDto` with new access token and rotated `phanilie_refresh_token` cookie.

---

## 5. User Sign Out

### `POST /api/auth/logout`

Revokes the active `RefreshToken` session in the database and clears the HTTP-only refresh cookie.

#### Response `200 OK`
```json
{
  "message": "Successfully signed out."
}
```
Header: `Set-Cookie: phanilie_refresh_token=; Path=/api/auth; Max-Age=0; HttpOnly`

---

## 6. Password Reset Request & Execution

### `POST /api/auth/forgot-password`

Generates a single-use, 1-hour cryptographic URL token in `PasswordResetTokens` table and dispatches email.

#### Request Body
```json
{
  "email": "student@phaniliemusic.com"
}
```

#### Response `200 OK`
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### `POST /api/auth/reset-password`

Consumes the reset token, updates `PasswordHash`, clears `FailedLoginCount` and `LockoutEnd`, and revokes active `RefreshTokens`.

#### Request Body
```json
{
  "token": "reset_token_guid_string",
  "newPassword": "NewSecurePassword123!"
}
```

#### Response `200 OK`
```json
{
  "message": "Password updated successfully. Account unlocked."
}
```
