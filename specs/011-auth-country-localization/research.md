# Research & Design Decisions: Auth & Country Localization

**Module**: `SPEC-011 Auth & Country Localization`  
**Date**: 2026-08-11  
**Status**: Completed Research Phase  

---

## 1. Password Hashing Strategy & Work Factor

### Question / Problem Statement
What password hashing algorithm and work factor should be used to satisfy security requirements while maintaining responsive authentication (<250ms)?

### Research Findings & Alternatives Evaluated
1. **PBKDF2 with HMAC-SHA256**:
   - *Pros*: Built-in .NET ASP.NET Core Identity default.
   - *Cons*: Slower against ASIC hardware; less standard than BCrypt for custom Web API implementations.
2. **Argon2id**:
   - *Pros*: Highly resistant to GPU memory attacks.
   - *Cons*: Native C library dependency issues across environments.
3. **BCrypt.Net-Next (Chosen)**:
   - *Pros*: Well-established industry standard. Work factor 11 provides ~100-150ms hash calculation time, fulfilling the <250ms login target while offering strong brute-force protection.

### Final Decision & Rationale
**Selected Approach**: BCrypt (`BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11)`).  
**Rationale**: Meets security governance standards, prevents plain-text leak vulnerabilities, and provides consistent cross-platform execution.

---

## 2. Multi-Device Refresh Token Rotation & Cookie Architecture

### Question / Problem Statement
How can we support secure multi-device sessions (laptop, phone, tablet) while preventing refresh token reuse and enabling instant session revocation?

### Research Findings & Alternatives Evaluated
1. **Stateless Refresh JWT**:
   - *Pros*: Zero database lookup during token refresh.
   - *Cons*: Cannot revoke individual compromised sessions or detect token theft reuse.
2. **Database-Backed Refresh Token Table with SHA-256 Hashing (Chosen)**:
   - *Pros*:
     - Client cookie `phanilie_refresh_token` contains unhashed raw token (`Guid:SecureRandomBytes`).
     - Backend stores `SHA256(Token)` in `RefreshTokens` database table with `UserId`, `DeviceInfo`, `ExpiresAt` (7 days), `RevokedAt`, and `ReplacedByTokenHash`.
     - When a token is refreshed, it is marked `RevokedAt = UtcNow` and a new token is issued (`ReplacedByTokenHash`).
     - **Reuse Detection**: If a revoked token is presented, the system flags a security breach and revokes ALL active refresh tokens for that user.

### Final Decision & Rationale
**Selected Approach**: Database-backed refresh token rotation with theft detection.  
**Cookie Policy**: `HttpOnly=true`, `Secure=true` (Production), `SameSite=Lax`, `Path=/api/auth/refresh`.

---

## 3. Geographic Country Detection & Currency Claim Engine

### Question / Problem Statement
How should country detection operate to pre-fill onboarding forms while enforcing the user-selected country precedence rule?

### Research Findings & Alternatives Evaluated
1. **Client-Side IP Fetching (`ipapi.co` / `ip-api.com`)**:
   - *Pros*: Simple frontend API call.
   - *Cons*: Blocked by ad-blockers; extra client network latency.
2. **Backend Header / GeoIP Service (`ILocalizationService`) (Chosen)**:
   - *Pros*: Backend checks incoming headers (`CF-IPCountry`, `X-Country-Code`, `X-Forwarded-For`) or MaxMind GeoIP reader.
   - **Precedence Rule Implementation**:
     - `GET /api/auth/geoip` returns `{ "countryCode": "ID", "currency": "IDR" }` to pre-fill frontend Sign Up form dropdown.
     - When user submits `POST /api/auth/signup`, the backend reads `RegisterDto.CountryCode`.
     - `CurrencyClaim` is calculated as: `RegisterDto.CountryCode.ToUpper() == "ID" ? "IDR" : "USD"`.
     - Form selection explicitly overrides IP detection.

---

## 4. Brute-Force Lockout & Password Recovery Flow

### Question / Problem Statement
How should account lockout behave after 5 failed login attempts, and how does password reset provide self-service early unlock?

### Research Findings & Alternatives Evaluated
1. **Lockout Policy**:
   - `UserAuth.FailedLoginCount` increments on invalid password.
   - When `FailedLoginCount >= 5`, `UserAuth.LockoutEnd = DateTime.UtcNow.AddMinutes(15)`.
   - Any login attempt during lockout returns `429 Too Many Requests`: *"Account temporarily locked. Try again in 15 minutes or reset your password."*
2. **Password Reset Link & Early Unlock**:
   - `POST /api/auth/forgot-password` generates a 64-character URL token hash in `PasswordResetTokens` table with 1-hour expiry.
   - `POST /api/auth/reset-password` verifies token, updates `PasswordHash`, clears `FailedLoginCount = 0`, sets `LockoutEnd = null`, and revokes all active `RefreshTokens`.
