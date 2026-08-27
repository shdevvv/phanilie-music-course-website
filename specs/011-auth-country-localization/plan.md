# Implementation Plan: SPEC-011 Auth & Country Localization

**Branch**: `011-auth-country-localization` | **Date**: 2026-08-11 | **Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/011-auth-country-localization/spec.md)

**Input**: Feature specification from `specs/011-auth-country-localization/spec.md`

---

## Summary

The **Auth & Country Localization** module handles user registration, authentication, BCrypt password security, token rotation, multi-device session management, 15-minute brute-force account lockout, password recovery, and geographic location detection (`IDR` for Indonesia, `USD` for International). IP detection auto-fills the onboarding form, but explicit user selection in the country dropdown determines final `CountryCode` and `CurrencyClaim`. Sessions issue 15-minute JWT access tokens and 7-day HTTP-only, `Secure`, `SameSite=Lax` refresh cookies backed by a database `RefreshTokens` session table.

---

## Technical Context

**Language/Version**: C# (.NET 9 ASP.NET Core Web API), TypeScript (React 18, Vite)  
**Primary Dependencies**: BCrypt.Net-Next, System.IdentityModel.Tokens.Jwt, Microsoft.AspNetCore.Authentication.JwtBearer, Lucide React Icons  
**Storage**: SQLite / PostgreSQL (`Users`, `RefreshTokens`, `PasswordResetTokens`)  
**Testing**: xUnit (Backend AuthService & Token Rotation Tests), Vitest / React Testing Library (Frontend UI)  
**Target Platform**: Modern Web Browsers (Desktop & Mobile viewports)  
**Project Type**: Web Application (ASP.NET Core Backend API + React Single Page App)  
**Performance Goals**: Authentication response <250ms; refresh token rotation <100ms  
**Constraints**: BCrypt work factor 11, HTTP-only cookie security, 15-minute lockout on 5 failed attempts  
**Scale/Scope**: Support 50k+ active student accounts & multi-device concurrent sessions  

---

## Constitution Check

*GATE: All checks passed. Compliant with Phanilie Music Platform Constitution v1.0.1.*

- [x] **Single Responsibility & Modular Design**: `AuthService` handles authentication, `LocalizationService` handles IP geolocation, `AuthController` handles REST routes.
- [x] **Loose Coupling & Interfaces**: High-level controllers depend on `IAuthService` and `ILocalizationService` interface abstractions.
- [x] **Code Quality & SOLID**: Models and DTOs enforce strict single-purpose security contracts without monolithic coupling.
- [x] **Testing Standards**: xUnit test suite covers BCrypt hashing, multi-device token rotation, and lockout logic.
- [x] **UX & Frontend Integration**: Glassmorphism auth modals integrate seamlessly into existing dark-mode gold theme (`#D4AF37`).
- [x] **Performance & Optimization**: Indexed lookup on `Email`, `TokenHash` (SHA-256) ensures sub-100ms database session verification.

---

## Project Structure

### Documentation (this feature)

```text
specs/011-auth-country-localization/
├── plan.md              # Implementation plan
├── research.md          # Phase 0 output (BCrypt, token rotation, GeoIP precedence)
├── data-model.md        # Phase 1 output (entities, ER diagrams, DTOs)
├── quickstart.md        # Phase 1 output (validation & end-to-end testing scenarios)
├── contracts/           # Phase 1 output
│   └── auth-api.md      # REST API contracts
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
backend/
├── Controllers/
│   └── AuthController.cs             # Sign Up, Sign In, Refresh, Logout, Forgot/Reset Password, GeoIP
├── Data/
│   └── ApplicationDbContext.cs       # DbSets for Users, RefreshTokens, PasswordResetTokens
├── Models/
│   ├── User.cs                       # Core UserAuth EF entity (CountryCode, CurrencyClaim, Lockout)
│   ├── RefreshToken.cs               # Multi-device session EF entity
│   ├── PasswordResetToken.cs         # Single-use reset token EF entity
│   └── AuthDtos.cs                   # RegisterDto, LoginDto, AuthResponseDto, GeoLocationDto
└── Services/
    ├── IAuthService.cs               # Auth strategy interface
    ├── AuthService.cs                # BCrypt hashing, JWT generation, session rotation & lockout logic
    ├── ILocalizationService.cs       # IP country detection strategy interface
    └── LocalizationService.cs        # Header inspection & GeoIP resolution
```

**Structure Decision**: Web application layout integrating into existing `backend/` (.NET Web API) and `frontend/` (React SPA).

---

## Complexity Tracking

> **No violations**. Design strictly adheres to Constitution v1.0.1 principles.
