# Research & Technical Decisions: User Profile & Account Management

## 1. Tabbed Profile Interface Strategy

- **Decision**: Tabbed component architecture in `userProfile.tsx` (`Profile`, `Subscription`, `Security`).
- **State**: Sync changes with `profileApi.ts` and local state for instant UI responsiveness.

## 2. Password Security & Validation

- **Decision**: Password change requires `CurrentPassword`, `NewPassword`, and `ConfirmPassword`.
- **Validation**: Minimum 6 characters, mismatch check, current password verification.

## 3. Active Subscription Overview

- **Decision**: Display membership tier, expiration date, IDR/USD prices, and status (`Active` | `Expired` | `Cancelled`).
