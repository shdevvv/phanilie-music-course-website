# Quickstart Validation Guide: Auth & Country Localization

**Module**: `SPEC-011 Auth & Country Localization`  
**Date**: 2026-08-11  

---

## 1. Overview & Setup Prerequisites

This quickstart guide validates BCrypt password hashing, IP country detection with form selection precedence, 15-minute JWT access tokens, 7-day HTTP-only refresh token rotation across multi-device sessions, 15-minute brute-force account lockout, and password recovery.

### Prerequisites
- Backend API running at `http://localhost:5000` (or `http://localhost:5181`)
- Frontend Dev Server running at `http://localhost:5173`
- SQLite / PostgreSQL database seeded with `Users` table

---

## 2. Test Scenarios & Step-by-Step Verification

### Scenario A: User Registration & Precedence Rule Verification
1. Open browser to `http://localhost:5173/` and click **"Sign Up"**.
2. **Expected Outcome**:
   - `GET /api/auth/geoip` auto-fills country dropdown based on request IP.
3. Manually select **"Indonesia"** (`ID`) in the dropdown form, enter valid email and password (`SecurePass123!`), and click **"Create Account"**.
4. **Expected Outcome**:
   - Backend hashes password with BCrypt (work factor 11).
   - User account is created with `CountryCode = "ID"` and `CurrencyClaim = "IDR"`.
   - Response returns a 15-minute JWT token and sets HTTP-only `phanilie_refresh_token` cookie.

---

### Scenario B: Multi-Device Login & Token Rotation
1. Sign in to account on Browser 1 (Desktop) and Browser 2 (Mobile Viewport / Incognito).
2. Inspect `RefreshTokens` database table.
3. **Expected Outcome**:
   - Two distinct active `RefreshToken` session records exist for the user, each tied to its device user-agent.
4. Wait 15 minutes or manually simulate access token expiration on Browser 1, then trigger an API call.
5. **Expected Outcome**:
   - `POST /api/auth/refresh` executes silently in under 100ms.
   - A new 15-minute JWT access token is issued and `phanilie_refresh_token` cookie is rotated without logging out Browser 2.

---

### Scenario C: Brute-Force Lockout & Password Reset Unlock
1. Attempt to sign in 5 consecutive times with an incorrect password for an existing student account.
2. **Expected Outcome**:
   - On the 5th failed attempt, backend updates `LockoutEnd = UtcNow.AddMinutes(15)` and returns `429 Too Many Requests`.
   - Frontend renders an alert modal: *"Account temporarily locked due to 5 failed login attempts. Reset password to unlock immediately."*
3. Click **"Reset Password"**, enter email address, and submit.
4. Open generated password reset URL link and submit new password.
5. **Expected Outcome**:
   - Password is updated with new BCrypt hash.
   - `FailedLoginCount` resets to `0` and `LockoutEnd` becomes `null`.
   - All previous refresh token sessions are revoked.
   - User can immediately sign in with new password.

---

## 3. Automated Command Verification

```bash
# Run backend unit tests for AuthController, BCrypt hashing, and RefreshTokenRotation
dotnet test backend/BackendAPI.csproj --filter "FullyQualifiedName~AuthServiceTests"

# Run frontend component tests for AuthModal & CountryDropdown
cd frontend && npm test -- src/components/SearchableCountryDropdown.test.tsx
```
