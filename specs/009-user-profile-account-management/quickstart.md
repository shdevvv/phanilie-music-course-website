# Quickstart & Validation Guide: User Profile & Account Management

## End-to-End Validation Scenarios

### Scenario 1: Profile Edit & Musical Bio
1. Open web application (`http://localhost:5173`).
2. Open User Profile (`/profile`).
3. Update display name, bio text, and select skill level ("Intermediate").
4. Click "Save Profile Changes" -> Verify success toast alert and updated profile header.

### Scenario 2: Subscription & Security Settings
1. Click "Subscription Plan" tab -> Verify plan tier name and renewal date.
2. Click "Security Settings" tab -> Enter current and matching new passwords.
3. Click "Update Password" -> Verify success confirmation alert.

## Build Verification Commands

```bash
# Frontend TypeScript & Vite build
cd frontend
npm run build

# Backend .NET API build
cd backend
dotnet build
```
