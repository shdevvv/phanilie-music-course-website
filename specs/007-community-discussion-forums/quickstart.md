# Quickstart & Validation Guide: Community Discussion Forums

## End-to-End Validation Scenarios

### Scenario 1: Channel Filter & Feed Browsing
1. Open web application (`http://localhost:5173`).
2. Navigate to "Community Forums" (`/forums`).
3. Click channel filter tabs (`Technique`, `Repertoire`, `Equipment`) -> Verify feed filters.

### Scenario 2: Thread Creation & Upvoting
1. Click "Start Discussion" button.
2. Fill out title, select category, enter post content, and click submit.
3. Verify new post appears in feed.
4. Click upvote icon -> Verify upvote count increments by 1.

## Build Verification Commands

```bash
# Frontend TypeScript & Vite build
cd frontend
npm run build

# Backend .NET API build
cd backend
dotnet build
```
