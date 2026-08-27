# Research & Technical Decisions: Student Achievement Badges & Gamification

## 1. Badge Criteria Evaluation Engine

- **Decision**: Implement `IBadgeService` and `BadgeService.cs` in Backend API.
- **Evaluation Criteria**:
  - `First Song Mastered`: `CompletedLessonsCount >= 1`
  - `Dedicated Learner`: `CompletedLessonsCount >= 5`
  - `Practice Enthusiast`: `TotalPracticeMinutes >= 300`
  - `Weekly Warrior`: `CurrentStreakDays >= 7`
- **Trigger**: Executed automatically upon lesson completion or practice log save.

## 2. Celebration Modal & Confetti Animation Strategy

- **Decision**: React component `BadgeCelebrationModal.tsx` rendered conditionally when `newlyUnlockedBadge` state is populated.
- **Visuals**: Animated badge icon, glowing warm rose backdrop, congratulatory text, and confetti trigger.

## 3. Showcase Grid & Progress Bar Calculation

- **Decision**: Endpoint `GET /api/badges/user` returning both unlocked badges (with `unlockedAt` timestamp) and locked badges with `currentValue`, `targetValue`, and `progressPercentage`.
