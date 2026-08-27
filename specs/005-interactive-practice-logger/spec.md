# Feature Specification: Interactive Practice Logger & Streaks

**Feature Branch**: `005-interactive-practice-logger`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: Live stopwatch practice timer, manual practice session logging, daily practice streak calculator, weekly day-of-week heatmap visualizer (Sun-Sat), and searchable practice history.

---

## User Scenarios & Testing

### User Story 1 - Live Stopwatch Practice Timer (Priority: P1)

As a Piano Student, I want to use an interactive live stopwatch timer while practicing so that I can accurately record how many minutes I spend practicing without needing a separate clock.

**Why this priority**: Core utility that encourages disciplined daily practice and provides real-time feedback.

**Independent Test**: Clicking "Start Practice" initializes the live timer; clicking "Save Session" auto-populates the logged minutes into the session log form.

**Acceptance Scenarios**:
1. **Given** a student on the practice logger dashboard (`/practice-log`), **When** they click "Start Practice", **Then** the live stopwatch begins incrementing seconds and minutes in real-time.
2. **Given** an active stopwatch timer, **When** the student clicks "Pause" or "Stop & Save", **Then** the elapsed duration is captured and presented in the log confirmation modal.

---

### User Story 2 - Practice Streak & Weekly Heatmap Visualizer (Priority: P2)

As a Student, I want to see my current daily practice streak counter and a weekly (Sun-Sat) progress indicator so that I stay motivated to practice consistently every day.

**Why this priority**: Gamifies practice consistency and drives student retention and daily habit formation.

**Independent Test**: Completing at least 1 practice session today increments the active streak counter (`🔥 X-Day Streak`) and highlights today's badge in the weekly Sun-Sat bar.

**Acceptance Scenarios**:
1. **Given** a student logging a practice session today, **When** saved successfully, **Then** the active streak counter increments by 1.
2. **Given** the weekly progress widget, **When** viewed on Sunday through Saturday, **Then** days with logged practice sessions show a green checkmark badge.

---

### User Story 3 - Manual Log Entry & Practice History (Priority: P3)

As a Student, I want to manually enter offline practice sessions (specifying duration, focus piece/lesson, and practice notes) and view a history of all past sessions so that I can track my growth over time.

**Why this priority**: Accommodates offline acoustic piano practice and allows students to review past notes and progress.

**Independent Test**: Submitting a manual log form adds the entry to the practice history list with timestamp, duration, piece title, and notes.

**Acceptance Scenarios**:
1. **Given** a student filling out the manual log form, **When** they enter duration (e.g. 45 mins), focus piece ("Chopin Nocturne Op. 9 No. 2"), and notes, **Then** saving adds the session to the top of the history feed.
2. **Given** the practice history list, **When** the student searches by song title or filters by date range, **Then** matching session logs are filtered in real-time.

---

### Edge Cases

- **Zero Duration Log Guard**: Attempting to save a 0-minute practice session displays a validation error prompt ("Practice session must be at least 1 minute").
- **Overnight Active Timer**: If a timer is left running past 4 hours without interaction, the system automatically pauses the timer and prompts for confirmation upon return.

---

## Requirements

### Functional Requirements

- **FR-005-1**: The system MUST provide a live interactive practice stopwatch timer (Start, Pause, Resume, Reset, Stop & Save).
- **FR-005-2**: The system MUST auto-calculate the user's active daily practice streak (consecutive days with at least 1 logged practice session).
- **FR-005-3**: The system MUST render a weekly day-of-week progress heatmap (`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`).
- **FR-005-4**: Users MUST be able to submit manual practice logs specifying duration (minutes), category/focus piece, difficulty rating, and notes.
- **FR-005-5**: The practice history view (`/practice-log`) MUST store and display past practice logs sorted chronologically with keyword search.

### Key Entities

- **PracticeLog**: Represents a logged practice session (Id, UserId, SessionDate, DurationMinutes, FocusTitle, Category, Notes, Rating, CreatedAt).
- **PracticeStreak**: Summarizes user streak stats (UserId, CurrentStreakDays, LongestStreakDays, LastPracticedDate).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Practice timer increments smoothly without skipping seconds (100% precision).
- **SC-002**: Daily streak counter and weekly heatmap update within 200 milliseconds of saving a log.
- **SC-003**: Practice log search returns matching history items in under 50 milliseconds.

---

## Assumptions

- Practice sessions logged on the same calendar day count towards today's streak badge.
- Practice history is stored persistently in local storage or PostgreSQL backend database.
