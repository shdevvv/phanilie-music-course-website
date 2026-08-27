# Data Model: Interactive Practice Logger & Streaks

## Entities & DTOs

### 1. PracticeLog (Entity)
- **id** (`integer`): Primary key.
- **userId** (`integer`): Foreign key referencing `User`.
- **sessionDate** (`datetime`): Calendar date of practice session.
- **durationMinutes** (`integer`): Practice duration in minutes.
- **focusTitle** (`string`): Song or lesson title practiced (e.g. "Chopin Nocturne").
- **category** (`string`): `Repertoire`, `Scales`, `Technique`, `SightReading`.
- **notes** (`string`): Session notes and reflection comments.
- **rating** (`string`): `Easy`, `Challenging`, `Mastered`.
- **createdAt** (`datetime`): Timestamp of creation.

### 2. DTO Models
- **CreatePracticeLogDto**: Includes DurationMinutes, FocusTitle, Category, Notes, Rating.
- **PracticeLogDto**: Includes Id, SessionDate, DurationMinutes, FocusTitle, Category, Notes, Rating.
- **PracticeStreakDto**:
  - `currentStreakDays` (`integer`): Active daily streak count.
  - `longestStreakDays` (`integer`): Personal best streak record.
  - `totalPracticeMinutes` (`integer`): Total lifetime minutes logged.
  - `weeklyDays` (`boolean[]`): 7-element array for Sun-Sat practice status.
