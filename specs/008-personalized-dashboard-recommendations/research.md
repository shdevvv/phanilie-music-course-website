# Research & Technical Decisions: Personalized Learning Dashboard & Recommendations

## 1. Recommendation Engine Algorithm

- **Decision**: Implement `IDashboardService` and `DashboardService.cs` in Backend API.
- **Algorithm**:
  1. Fetch completed lesson IDs for user.
  2. Iterate through `levels` -> `topics` -> `lessons`.
  3. First lesson without a completed record is designated `NextRecommendedLesson`.
  4. If all completed -> return `MasteryAchieved` flag.

## 2. To-Do Checklist Persistence

- **Decision**: Dual storage (Client LocalStorage for instant UI feedback + API fallback).

## 3. Progress Meter SVG Rendering

- **Decision**: Circular SVG meter calculating `strokeDashoffset` dynamically based on `overallMasteryPct`.
