# Feature Specification: SPEC-011 Auth & Country Localization

**Module Directory**: `docs/specs/011-auth-and-country-localization`  
**Status**: Approved Specification  
**Target Workflow**: `/speckit.specify`  

---

## 1. Feature Overview & Core Purpose
The **Auth & Country Localization** module handles user registration, authentication, token rotation, and detects geographic location to attach appropriate currency claims (`IDR` for Indonesia, `USD` for International).

## 2. Functional Requirements
* **FR-011-1**: Support user Sign Up, Sign In, Refresh Token rotation, and Password Reset.
* **FR-011-2**: Automatically detect visitor country code during auth/onboarding.
* **FR-011-3**: Assign `IDR` currency claim for country code `ID`, otherwise `USD`.
* **FR-011-4**: Passwords MUST be securely hashed with BCrypt.

## 3. User Experience Guidelines
Glassmorphism modal dialogs, password strength indicators, tab switching, and regional currency badge indicators.
