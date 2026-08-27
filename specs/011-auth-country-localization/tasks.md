# Tasks: Auth & Country Localization

**Input**: Design documents from `/specs/011-auth-country-localization/`  
**Prerequisites**: [plan.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/011-auth-country-localization/plan.md), [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/011-auth-country-localization/spec.md), [research.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/011-auth-country-localization/research.md), [data-model.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/011-auth-country-localization/data-model.md), [contracts/auth-api.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/011-auth-country-localization/contracts/auth-api.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic directory structure verification.

- [x] T001 Create feature branch `011-auth-country-localization` and verify specs structure in `specs/011-auth-country-localization/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database entities, security fields, DTOs, and service abstractions required before implementing user stories.

- [x] T002 [P] Update `User` entity in `backend/Models/User.cs` to add `PasswordHash`, `Role`, `CountryCode`, `CurrencyClaim`, `FailedLoginCount`, and `LockoutEnd`
- [x] T003 [P] Create `RefreshToken` multi-device session entity in `backend/Models/RefreshToken.cs`
- [x] T004 [P] Create `PasswordResetToken` single-use token entity in `backend/Models/PasswordResetToken.cs`
- [x] T005 [P] Create authentication & localization DTOs (`RegisterDto`, `LoginDto`, `AuthResponseDto`, `GeoLocationDto`, `ResetPasswordDto`) in `backend/Models/AuthDtos.cs`
- [x] T006 Update `ApplicationDbContext.cs` in `backend/Data/ApplicationDbContext.cs` to add DbSets (`Users`, `RefreshTokens`, `PasswordResetTokens`) and configure indexes
- [x] T007 Apply EF Core database migration for auth and token tables in `backend/Data/`
- [x] T008 Create `IAuthService` and `ILocalizationService` interface contracts in `backend/Services/IAuthService.cs` and `backend/Services/ILocalizationService.cs`

---

## Phase 3: User Story 1 - User Registration & Secure Authentication (Priority: P1) 🎯 MVP

- [x] T009 [US1] Implement BCrypt password hashing, JWT token generation, and authentication methods in `backend/Services/AuthService.cs`
- [x] T010 [US1] Implement `POST /api/auth/signup` and `POST /api/auth/signin` endpoints in `backend/Controllers/AuthController.cs`
- [x] T011 [P] [US1] Implement frontend authentication API client in `frontend/src/services/authApi.ts`
- [x] T012 [P] [US1] Implement `AuthContext` state provider in `frontend/src/context/AuthContext.tsx`
- [x] T013 [US1] Implement glassmorphism Sign In modal component in `frontend/src/signIn.tsx`
- [x] T014 [US1] Implement glassmorphism Sign Up modal component with password strength indicator in `frontend/src/signUp.tsx`

---

## Phase 4: User Story 2 - Automatic Country & Currency Localization (Priority: P2)

- [x] T015 [US2] Implement IP country detection service `LocalizationService` in `backend/Services/LocalizationService.cs`
- [x] T016 [US2] Expose `GET /api/auth/geoip` endpoint in `backend/Controllers/AuthController.cs`
- [x] T017 [US2] Enforce form selection precedence rule over IP detection in `backend/Services/AuthService.cs`
- [x] T018 [P] [US2] Connect `SearchableCountryDropdown.tsx` to `GET /api/auth/geoip` in `frontend/src/SearchableCountryDropdown.tsx`
- [x] T019 [US2] Integrate country dropdown & currency claim feedback into `signUp.tsx` in `frontend/src/signUp.tsx`

---

## Phase 5: User Story 3 - Token Rotation & Password Recovery (Priority: P3)

- [x] T020 [US3] Implement database refresh token rotation, theft detection, and multi-device session handling in `backend/Services/AuthService.cs`
- [x] T021 [US3] Implement 15-minute brute-force account lockout policy after 5 failed login attempts in `backend/Services/AuthService.cs`
- [x] T022 [US3] Implement password reset token generation & consumption in `backend/Services/AuthService.cs`
- [x] T023 [US3] Expose `POST /api/auth/refresh`, `POST /api/auth/logout`, `POST /api/auth/forgot-password`, and `POST /api/auth/reset-password` endpoints in `backend/Controllers/AuthController.cs`
- [x] T024 [P] [US3] Implement Forgot Password glassmorphism component in `frontend/src/forgotPassword.tsx`
- [x] T025 [US3] Connect refresh token silent rotation interceptor in `frontend/src/services/authApi.ts`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T026 [P] Add backend unit tests for `AuthService` (BCrypt work factor, refresh token rotation, brute-force lockout, GeoIP precedence) in `backend/Tests/AuthServiceTests.cs`
- [x] T027 Run end-to-end quickstart validation scenarios per `specs/011-auth-country-localization/quickstart.md`
