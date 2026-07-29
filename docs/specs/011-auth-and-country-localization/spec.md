# Feature Specification: 011 - Authentication & Country Localization Logic

**Feature Directory**: `specs/011-auth-and-country-localization`
**Created**: 2026-07-29
**Status**: Approved

## Requirements
- **FR-001**: System MUST provide `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, and `POST /api/auth/refresh-token`.
- **FR-002**: Password hashing MUST use BCrypt.
- **FR-003**: JWT payload MUST embed `user_id`, `role`, `country_code`, and `currency`.
