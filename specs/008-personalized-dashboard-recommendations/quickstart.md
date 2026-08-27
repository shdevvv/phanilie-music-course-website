# Quickstart & Validation Guide: Personalized Learning Dashboard & Recommendations

## End-to-End Validation Scenarios

### Scenario 1: Progress Metrics & Next Recommended Lesson
1. Open web application (`http://localhost:5173`).
2. Navigate to Dashboard (`/dashboard`).
3. Observe Overall Progress circular SVG meter and Next Recommended Lesson card.
4. Click "Resume" -> Verify navigation to target lesson.

### Scenario 2: Student To-Do Checklist
1. Type a task title in the To-Do input on the dashboard.
2. Click "Add Task" -> Verify task appears in list.
3. Check the checkbox -> Verify task strikes through and completion state persists.

## Build Verification Commands

```bash
# Frontend TypeScript & Vite build
cd frontend
npm run build

# Backend .NET API build
cd backend
dotnet build
```
