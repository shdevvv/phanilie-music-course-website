# Quickstart & Validation Guide: Interactive Practice Logger & Streaks

## End-to-End Validation Scenarios

### Scenario 1: Live Practice Timer
1. Open web application (`http://localhost:5173`).
2. Navigate to "Practice Log" (`/practice-log`).
3. Click "Start Timer" -> Verify stopwatch timer increments.
4. Click "Pause" -> Verify timer halts.
5. Click "Stop & Save" -> Verify modal opens with elapsed minutes.

### Scenario 2: Practice Streak & Heatmap Update
1. Submit a practice log session.
2. Observe active streak badge (`🔥 X-Day Streak`).
3. Observe weekly Sun-Sat breakdown bar -> Today's day badge highlights green.

### Scenario 3: Practice Log History Search
1. Enter search keyword (e.g. "Gospel" or "Jazz") in the search input on `/practice-log`.
2. Verify list filters matching sessions in real-time.

## Build Verification Commands

```bash
# Frontend TypeScript & Vite build
cd frontend
npm run build

# Backend .NET API build
cd backend
dotnet build
```
