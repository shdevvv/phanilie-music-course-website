# Feature Specification: Auth & Country Localization

**Feature Branch**: `011-auth-country-localization`  
**Created**: 2026-08-11  
**Status**: Approved Specification  
**Input**: User description: "docs/specs/011/spec.md"

---

## Clarifications

### Session 2026-08-11

- Q: Country & Currency Selection Precedence → A: Form selection takes precedence (auto-fill dropdown from IP detection, but user selection determines final Country & Currency claim).
- Q: Refresh Token Session Management → A: Database-backed session table supporting multi-device logins with independent token rotation per device.
- Q: Password Recovery Mechanism → A: Single-use, time-limited reset URL link sent via email (expires in 1 hour).
- Q: Brute-Force Lockout Policy → A: Automatic 15-minute lock with option to unlock immediately via Password Reset link.
- Q: Token Lifespan & Cookie Security → A: 15-minute JWT Access Token + 7-day HTTP-only, Secure, SameSite=Lax Refresh Token Cookie.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration & Secure Authentication (Priority: P1)

As a new or returning student, I want to register for an account or sign in with my email and password so that I can access my personalized learning dashboard, purchase sheet music, and save my progress.

**Why this priority**: Core security baseline and access gateway for the platform; required for all personalized student and subscription features.

**Independent Test**: Registering a new account creates a user with BCrypt hashed credentials, issues JWT tokens, and allows signing in to access authenticated routes across multiple devices.

**Acceptance Scenarios**:

1. **Given** a new visitor on the Sign Up modal, **When** they submit full name, valid email, password, and select country, **Then** an account is created with BCrypt hashed password, returning a 15-minute JWT access token and attaching a 7-day HTTP-only `SameSite=Lax` refresh cookie.
2. **Given** a registered student on the Sign In form, **When** they submit valid credentials, **Then** the system authenticates the user, creates a database session record for that device, and grants access to protected routes.
3. **Given** invalid credentials on Sign In, **When** submitted, **Then** a clear error message ("Invalid email or password") is displayed without revealing whether the email exists.

---

### User Story 2 - Automatic Country & Currency Localization (Priority: P2)

As an onboarding student or visitor, I want the platform to detect my geographic country location during registration so that prices and currency claims are automatically pre-filled, while allowing manual form override (`IDR` for Indonesia, `USD` for International).

**Why this priority**: Essential for localized pricing across domestic (Indonesia) and international student bases while respecting user explicit preference.

**Independent Test**: Registering with country `ID` assigns `IDR` currency claim; registering from outside Indonesia or selecting an international country assigns `USD` currency claim.

**Acceptance Scenarios**:

1. **Given** a user registering from an IP address in Indonesia (`ID`), **When** the registration modal opens, **Then** the country dropdown auto-fills with "Indonesia" (`ID`) and assigns `IDR` currency claim upon submission.
2. **Given** a user registering from outside Indonesia (e.g. `US`, `SG`), **When** the registration modal opens, **Then** the country dropdown auto-fills with their detected country and assigns `USD` currency claim upon submission.
3. **Given** a user whose detected IP is `US` who manually changes the form selection to "Indonesia", **When** submitted, **Then** the user's explicit form selection takes precedence, assigning country `ID` and currency claim `IDR`.

---

### User Story 3 - Token Rotation & Password Recovery (Priority: P3)

As a registered student, I want my active multi-device sessions maintained securely through refresh token rotation and access to a password reset link flow so that I can safely maintain account access.

**Why this priority**: Enhances security posture against session hijacking while providing self-service account recovery and early lockout unlock.

**Independent Test**: Presenting an expired 15-minute access token alongside a valid 7-day HTTP-only refresh token issues a new access token and rotated refresh token; requesting password reset generates a 1-hour single-use URL link that also unlocks locked accounts.

**Acceptance Scenarios**:

1. **Given** an expired 15-minute access token, **When** a request is made with a valid HTTP-only refresh token, **Then** the backend verifies the database session, issues a new access token, and rotates the refresh token for that specific device.
2. **Given** a student who forgot their password or is locked out, **When** they enter their registered email on Forgot Password page, **Then** a single-use tokenized reset URL link (valid for 1 hour) is generated and sent via email.
3. **Given** a student opening the password reset URL link, **When** they submit a new valid password, **Then** the password is updated, account lockout is cleared, and all existing refresh token sessions are revoked.

---

### Edge Cases

- **IP Geolocation Failure**: If IP country lookup fails or returns unknown, auto-fill defaults to `US` (`USD` currency claim) and allows manual country selection.
- **Account Lockout Policy**: After 5 consecutive failed login attempts within 15 minutes, temporarily lock the account for 15 minutes. Provide a direct link in the lockout alert offering early unlock via Password Reset.
- **Password Strength Guard**: Reject passwords shorter than 8 characters or lacking a mix of alphanumeric characters.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-011-1**: System MUST support user registration (Sign Up), authentication (Sign In), refresh token rotation, and password recovery.
- **FR-011-2**: Passwords MUST be securely hashed with BCrypt prior to storage in the database.
- **FR-011-3**: System MUST auto-detect user geographic country code during onboarding to pre-fill the country form, but explicit form selection MUST take precedence for assigning account `CountryCode` and `CurrencyClaim` (`IDR` if country code is `ID`, otherwise `USD`).
- **FR-011-4**: System MUST issue short-lived JWT access tokens (15 minutes) and HTTP-only, `Secure`, `SameSite=Lax` refresh tokens (7 days) backed by a database session table supporting concurrent multi-device logins with independent token rotation per device.
- **FR-011-5**: System MUST provide a secure password recovery flow using single-use, time-limited (1 hour) URL reset token links sent via email.
- **FR-011-6**: System MUST enforce 15-minute account lockout after 5 consecutive failed login attempts, with immediate early unlock capability via Password Reset.
- **FR-011-7**: System MUST enforce password validation rules (minimum 8 characters, requiring alphanumeric characters).
- **FR-011-8**: System MUST render glassmorphism modal dialogs with interactive tab switching, password visibility toggles, strength indicators, and searchable country selection.

### Key Entities

- **UserAuth**: Core user security entity (User ID, Email, PasswordHash, Role, CountryCode, CurrencyClaim, FailedLoginCount, LockoutEnd, CreatedAt, LastLoginAt).
- **RefreshToken**: Active multi-device session record (Id, UserId, DeviceInfo, TokenHash, ExpiresAt, CreatedAt, RevokedAt, ReplacedByTokenHash).
- **GeoLocationInfo**: Country detection metadata (IPAddress, CountryCode, CountryName, DefaultCurrency).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User authentication (Sign Up / Sign In) completes within 250ms.
- **SC-002**: 100% of stored passwords in the database use BCrypt hashing with minimum work factor 11.
- **SC-003**: 100% of user registrations assigning country `ID` receive `IDR` currency claim, and 100% of international selections receive `USD`.
- **SC-004**: Refresh token rotation completes seamlessly in under 100ms without user login interruption across multi-device sessions.

---

## Assumptions

- IP geolocation uses standard HTTP request headers (`CF-IPCountry`, `X-Forwarded-For`) with fallback to IP lookup service.
- Default currency for international users outside Indonesia is `USD`.
- Password reset token links expire after 1 hour and invalidate all active refresh token sessions upon password reset completion.
