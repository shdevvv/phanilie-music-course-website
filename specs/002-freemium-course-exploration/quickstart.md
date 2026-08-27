# Quickstart & Validation Guide: Freemium Course Exploration

## End-to-End Validation Scenarios

### Scenario 1: Public Course Hierarchy Browsing
1. Open web application (`http://localhost:5173`).
2. Click "Courses" in top navigation bar.
3. Verify course cards filterable by `All`, `Beginner`, `Intermediate`, `Advanced`.
4. Click on a course to expand topics and lesson metadata.

### Scenario 2: Paywall Guard & Upgrade Modal Trigger
1. Ensure user is not logged in or logged in as a free student (`IsSubscribed = false`).
2. Navigate to any lesson in the curriculum.
3. Click "Watch Full Lesson" or "Download PDF Score".
4. Verify HTTP 403 Forbidden response is handled cleanly and the Membership Plan Upgrade Modal opens.
5. Click "Subscribe Now" -> Verify guest redirected to Sign In / Sign Up view.

### Scenario 3: Active Subscriber Unrestricted Access
1. Log in as an active subscriber (e.g. `admin@phanilie.com` / `Admin@Phanilie2026!`).
2. Navigate to a lesson.
3. Click "Watch Full Lesson".
4. Verify video playback initializes immediately without paywall interruption.

## Build Verification Commands

```bash
# Frontend TypeScript & Vite build
cd frontend
npm run build

# Backend .NET API build
cd backend
dotnet build
```
