# Data Model: Student Achievement Badges & Gamification

## Entities & DTOs

### 1. Badge (Entity - Pre-seeded)
- **id** (`integer`): Primary key.
- **name** (`string`): Badge title (e.g. "First Song Mastered").
- **description** (`string`): Milestone description.
- **iconUrl** (`string`): Icon or emoji identifier.
- **requirementType** (`string`): `LessonCount`, `PracticeMinutes`, `Streak`.
- **requirementValue** (`integer`): Target threshold value (e.g. `1`, `5`, `300`, `7`).

### 2. UserBadge (Entity)
- **id** (`integer`): Primary key.
- **userId** (`integer`): Foreign key referencing `User`.
- **badgeId** (`integer`): Foreign key referencing `Badge`.
- **unlockedAt** (`datetime`): Timestamp of unlock.

### 3. UserBadgeDto
- **badgeId** (`integer`): Badge ID.
- **name** (`string`): Badge title.
- **description** (`string`): Milestone description.
- **iconUrl** (`string`): Badge icon.
- **isUnlocked** (`boolean`): Unlock status.
- **unlockedAt** (`datetime?`): Date unlocked if earned.
- **currentValue** (`integer`): Current progress counter.
- **targetValue** (`integer`): Threshold required.
- **progressPercentage** (`integer`): Progress percentage (0 to 100).
