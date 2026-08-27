# Data Model: Personalized Learning Dashboard & Recommendations

## Entities & DTOs

### 1. DashboardSummaryDto
- **overallMasteryPct** (`integer`): Percentage (0-100).
- **completedLessonsCount** (`integer`): Completed lessons counter.
- **totalLessonsCount** (`integer`): Total lessons in curriculum.
- **totalPracticeMinutes** (`integer`): Total practice duration.
- **totalXP** (`integer`): Earned XP points.
- **nextRecommendedLesson**:
  - `lessonId` (`integer`): Target lesson ID.
  - `levelNumber` (`integer`): Level index.
  - `topicTitle` (`string`): Topic title.
  - `lessonTitle` (`string`): Lesson title.
  - `durationMinutes` (`integer`): Duration.
  - `videoUrl` (`string`): Video URL.

### 2. UserTodoDto
- **id** (`integer`): Primary key.
- **taskDescription** (`string`): Task title.
- **isCompleted** (`boolean`): Completion flag.
- **createdAt** (`datetime`): Timestamp.
