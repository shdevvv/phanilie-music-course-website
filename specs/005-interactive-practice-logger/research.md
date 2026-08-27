# Research & Technical Decisions: Interactive Practice Logger & Streaks

## 1. Practice Timer & Stopwatch Strategy

- **Decision**: Custom React hook `usePracticeTimer.ts` utilizing `useRef` and `setInterval`.
- **State Management**: Controls `isTimerRunning`, `elapsedSeconds`, `startTimer()`, `pauseTimer()`, `resetTimer()`, `stopAndSave()`.
- **Precision**: 1-second interval update with tab switch correction using `performance.now()`.

## 2. Streak Calculation & Day-of-Week Heatmap Algorithm

- **Decision**: Encapsulate streak algorithm in `accomplishmentHelper.ts` and `backend/Services/PracticeLogService.cs`.
- **Algorithm**:
  1. Sort user practice logs descending by date.
  2. Extract distinct practice dates (formatted `YYYY-MM-DD`).
  3. Calculate consecutive day sequence counting backwards from today/yesterday.
  4. Build Sun-Sat boolean array checking if any log exists for each weekday in the current week.

## 3. Practice History Storage & API Endpoint

- **Decision**: `GET /api/practicelogs` and `POST /api/practicelogs` with EF Core DbContext.
- **Client Cache**: LocalStorage fallback sync for offline usage.
