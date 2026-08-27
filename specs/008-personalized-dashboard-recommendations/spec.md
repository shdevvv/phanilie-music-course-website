# Feature Specification: Personalized Learning Dashboard & Recommendations

**Feature Branch**: `008-personalized-dashboard-recommendations`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: Student learning progress metrics (overall mastery %, completed lessons count, total practice time, total XP), Next Recommended Lesson widget, interactive Student To-Do checklist widget, and Saved for Later study bookmarks list.

---

## User Scenarios & Testing

### User Story 1 - Overall Mastery & Learning Progress Metrics (Priority: P1)

As a Piano Student, I want to see a clear visual dashboard of my overall course mastery percentage, completed lessons, total practice hours, and total earned XP so that I can easily track my musical growth.

**Why this priority**: Core high-level overview screen providing immediate feedback on learning progress.

**Independent Test**: Completing a lesson updates the circular mastery percentage meter and completed lessons counter on `/dashboard`.

**Acceptance Scenarios**:
1. **Given** a student on the dashboard (`/dashboard`), **When** viewed, **Then** the Overall Progress card displays a circular SVG mastery meter and completed lesson count.
2. **Given** completed practice sessions and lessons, **When** viewed, **Then** total practice minutes and total XP update in real-time.

---

### User Story 2 - Next Recommended Lesson Engine Widget (Priority: P2)

As a Student, I want the dashboard to suggest my next recommended lesson based on my current level and topic progress so that I can resume learning with a single click.

**Why this priority**: Reduces friction in continuing the curriculum pathway and guides student momentum.

**Independent Test**: Clicking "Continue Learning" on the Next Recommended Lesson card navigates directly to the target lesson view.

**Acceptance Scenarios**:
1. **Given** a student who completed Lesson 2 of Level 1, **When** they view the dashboard, **Then** the Next Recommended Lesson card highlights Lesson 3 with title, duration, and "Resume" button.
2. **Given** a student who completed all lessons in Level 1, **When** viewed, **Then** the card automatically recommends Lesson 1 of Level 2.

---

### User Story 3 - Interactive Student To-Do Checklist & Saved Items List (Priority: P3)

As a Student, I want to create personal practice checklist items (e.g. "Practice C Major scale at 80 BPM") and manage saved sheet music/lessons so that I can organize my daily practice routine.

**Why this priority**: Supports self-directed practice organization and personalized study bookmarks.

**Independent Test**: Adding a new to-do item appends it to the list; toggling completion strikes out the item; saving a sheet music item adds it to "Saved for Later".

**Acceptance Scenarios**:
1. **Given** the Student To-Do widget, **When** a user types a task title and clicks Add, **Then** the task appears in the checklist.
2. **Given** the Saved for Later list, **When** a user clicks a saved item, **Then** it opens the sheet music or lesson modal immediately.

---

### Edge Cases

- **100% Curriculum Completed**: When all lessons across all levels are completed, the Next Recommended Lesson card displays a "Mastery Achieved! Review Past Lessons" badge.
- **Empty Saved Items**: If no items are saved for later, the section displays an empty state with a link to the Sheet Music Store (`/covers-sheets`).

---

## Requirements

### Functional Requirements

- **FR-008-1**: The system MUST calculate overall course mastery percentage based on completed vs total available lessons.
- **FR-008-2**: The system MUST calculate and display the Next Recommended Lesson based on the user's highest completed lesson index.
- **FR-008-3**: The system MUST provide an interactive Student To-Do checklist (Create, Read, Toggle Complete, Edit, Delete).
- **FR-008-4**: The system MUST provide a "Saved for Later" study list displaying bookmarked sheet music and lessons.
- **FR-008-5**: The system MUST return dashboard metrics via `GET /api/dashboard/summary`.

### Key Entities

- **DashboardSummaryDto**: OverallMasteryPct, CompletedLessonsCount, TotalLessonsCount, TotalPracticeMinutes, TotalXP, NextLesson (Id, LevelNumber, TopicTitle, LessonTitle, DurationMinutes).
- **UserTodo**: Id, UserId, TaskDescription, IsCompleted, CreatedAt.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Dashboard progress metrics update within 50 milliseconds.
- **SC-002**: Next Recommended Lesson calculation evaluates accurately for 100% of curriculum progress states.
- **SC-003**: Student To-Do list state persists reliably across page reloads.

---

## Assumptions

- Progress calculations integrate with existing `UserProgress` and `PracticeLog` backend tables and local storage fallbacks.
