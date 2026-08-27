# Feature Specification: Student Achievement Badges & Gamification

**Feature Branch**: `006-achievement-badges-gamification`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: System achievement badges unlock system ("First Song Mastered", "Dedicated Learner", "Practice Enthusiast", "Weekly Warrior"), animated badge unlock celebration popup modal, progress bars toward locked badges, and student profile badge showcase.

---

## User Scenarios & Testing

### User Story 1 - Badge Unlock Event & Celebration Modal (Priority: P1)

As a Piano Student, when I hit a practice or lesson completion milestone, I want the system to award me a digital badge and display an animated celebration modal so that I feel recognized and motivated to keep learning.

**Why this priority**: Immediate positive reinforcement encourages continued practice and course completion.

**Independent Test**: Completing a qualifying action (e.g. 1st lesson completed) triggers the "Badge Unlocked!" celebration modal with badge icon, title, description, and confetti animation.

**Acceptance Scenarios**:
1. **Given** a student completing their first lesson, **When** the lesson is marked complete, **Then** the system unlocks "First Song Mastered" badge and pops up the celebration modal.
2. **Given** a student maintaining a 7-day streak, **When** today's practice log is saved, **Then** the "Weekly Warrior" badge unlocks with the celebration modal.

---

### User Story 2 - Dashboard & Profile Badge Showcase (Priority: P2)

As a Student, I want to see all my unlocked badges and view progress bars for locked badges on my dashboard so that I know what milestones I can aim for next.

**Why this priority**: Provides clear goals and transparent gamification progression.

**Independent Test**: Opening `/dashboard` displays the Badge Showcase grid highlighting unlocked badges in full color and locked badges with percentage progress bars (e.g. `3/5 Sessions`).

**Acceptance Scenarios**:
1. **Given** a student on the dashboard or profile page, **When** viewing the Badge Showcase, **Then** unlocked badges render in vibrant colors with earned date.
2. **Given** locked badges in the showcase, **When** viewed, **Then** each displays a progress bar (e.g. `2 / 5 Practice Days`).

---

### User Story 3 - Milestone Criteria Evaluation Engine (Priority: P3)

As a Platform Admin, I want the backend to automatically evaluate badge eligibility rules (`LessonCount`, `PracticeMinutes`, `StreakDays`) after user activities so that badges are awarded reliably and securely without manual intervention.

**Why this priority**: Ensures badge system reliability and prevents duplicate badge awards.

**Independent Test**: Triggering an activity API call evaluates badge conditions and records an entry in `UserBadge` table only if not previously unlocked.

**Acceptance Scenarios**:
1. **Given** a student completing an action, **When** evaluated by `BadgeService`, **Then** any newly satisfied badge criteria inserts a `UserBadge` record.
2. **Given** an already unlocked badge, **When** evaluated again, **Then** duplicate entries are prevented.

---

### Edge Cases

- **Retroactive Unlock**: Existing users who already meet milestone requirements upon feature release receive earned badges automatically upon their next login.
- **Multiple Simultaneous Unlocks**: If a single action unlocks multiple badges, the celebration modal queues them sequentially.

---

## Requirements

### Functional Requirements

- **FR-006-1**: The system MUST support system achievement badges:
  - `First Song Mastered` (Complete 1st lesson)
  - `Dedicated Learner` (Complete 5 lessons)
  - `Practice Enthusiast` (Log 300+ total practice minutes)
  - `Weekly Warrior` (Achieve 7-day practice streak)
- **FR-006-2**: The system MUST render an animated Badge Unlock Celebration Modal when a user unlocks a badge.
- **FR-006-3**: The dashboard and profile views MUST display a Badge Showcase grid featuring unlocked badges and progress bars for locked badges.
- **FR-006-4**: Badge unlocks MUST be idempotent (each badge can only be awarded once per user).
- **FR-006-5**: The system MUST return unlocked badges via `GET /api/badges` and `GET /api/badges/user`.

### Key Entities

- **Badge**: Defines an achievement milestone (Id, Name, Description, IconUrl, RequirementType, RequirementValue).
- **UserBadge**: Tracks user earned badges (Id, UserId, BadgeId, UnlockedAt).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Celebration modal renders within 100 milliseconds of badge unlock detection.
- **SC-002**: 0% duplicate badge records in database.
- **SC-003**: Badge progress percentage calculates accurately across 100% of locked badges.

---

## Assumptions

- Pre-seeded badges ("First Song Mastered", "Dedicated Learner", "Practice Enthusiast", "Weekly Warrior") exist in the database from seeding initialization.
