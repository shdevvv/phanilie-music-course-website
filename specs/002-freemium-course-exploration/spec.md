# Feature Specification: 002 Freemium Course Exploration & Paywall Guard

**Feature Branch**: `002-freemium-course-exploration`  
**Created**: 2026-07-29  
**Status**: Approved Specification  
**Input**: Freemium course tree exploration, level and topic navigation, paywall authorization guard, membership upgrade modal, and active subscriber video streaming.  

---

## User Scenarios & Testing

### User Story 1 - Freemium Curriculum Exploration (Priority: P1)

As an Unauthenticated Visitor or Free Student, I want to freely browse the entire course curriculum tree (Course Levels, Topics, Lesson titles, descriptions, and duration metadata) so that I can evaluate course quality and depth before deciding to subscribe.

**Why this priority**: Open curriculum exploration removes pre-purchase hesitation and drives organic visitor-to-subscriber conversion.

**Independent Test**: Navigating to the courses page allows expanding Beginner, Intermediate, and Advanced levels, inspecting topic objectives, and viewing lesson metadata without encountering authentication prompts.

**Acceptance Scenarios**:
1. **Given** an unauthenticated visitor on the courses page, **When** they expand a course level (e.g., "Intermediate Piano"), **Then** they can view all topics, lesson titles, prerequisites, and estimated video durations.
2. **Given** a free registered student inspecting lesson details, **When** they view lesson metadata, **Then** learning objectives and instructor notes are displayed clearly.

---

### User Story 2 - Paywall Restriction & Upgrade Modal (Priority: P2)

As a Free Registered Student or Visitor, when I attempt to play a locked lesson video or download a lesson sheet music PDF, I want the system to gracefully block access and present a clear Membership Plan Upgrade modal so that I can select a subscription plan.

**Why this priority**: Protects premium video instructional content and downloadable lesson PDFs while presenting immediate monetization conversion opportunities.

**Independent Test**: Clicking "Play Video" on a locked lesson without an active subscription displays an overlay modal highlighting plan tiers (`Monthly`, `Quarterly`, `Annual`) with regional checkout CTAs.

**Acceptance Scenarios**:
1. **Given** a user without an active subscription, **When** they click "Play Lesson Video" or "Download Lesson Sheet", **Then** media playback/download is blocked and a Membership Plan Upgrade modal is displayed.
2. **Given** the Membership Plan Upgrade modal displayed on screen, **When** the user selects a subscription tier (e.g., "Monthly Plan"), **Then** they are directed immediately to the checkout page with their regional currency selected.

---

### User Story 3 - Subscriber Streaming & PDF Access (Priority: P3)

As an Active Subscriber or Platform Administrator, when I access any video lesson or lesson PDF, I want immediate, uninterrupted video streaming and file downloads so that I can learn without barriers.

**Why this priority**: Delivers core value to paying subscribers.

**Independent Test**: Logging in as an active subscriber allows playing video lessons directly and downloading lesson PDFs without encountering paywalls.

**Acceptance Scenarios**:
1. **Given** an authenticated user with an active subscription, **When** they open any video lesson, **Then** video streaming begins immediately without paywall interruptions.
2. **Given** an authenticated user with role `Admin`, **When** they access any course media asset, **Then** full streaming and download access is granted.

---

### Edge Cases
- **Subscription Expiration During Session**: What happens if a user's subscription expires while they are actively watching a video course? Upon attempting to load the next lesson, the system MUST enforce paywall restrictions and present the renewal modal.
- **Direct Asset URL Tampering**: How does the system prevent non-subscribers from guessing or forging direct media URLs? All media endpoints MUST validate authorization claims on every request before serving media streams.

---

## Requirements

### Functional Requirements

- **FR-002-1**: The system MUST allow public browsing of the entire course curriculum tree (`Levels`, `Topics`, `Lessons` metadata) without authentication.
- **FR-002-2**: The system MUST strictly restrict access to lesson video streams and downloadable lesson PDFs to users with an active `Subscriber` or `Admin` role.
- **FR-002-3**: Attempting to access restricted media without an active subscription MUST return an explicit authorization restriction signal (`403 Forbidden`).
- **FR-002-4**: The frontend MUST intercept media access restrictions and render a Membership Plan Upgrade modal displaying available subscription tiers (`Monthly`, `Quarterly`, `Annual`).
- **FR-002-5**: Active Subscribers and Administrators MUST receive uninterrupted video media streams and downloadable lesson PDFs.

### Key Entities

- **CourseLevel**: Represents difficulty levels (`Beginner`, `Intermediate`, `Advanced`).
- **Topic**: Represents sub-categories within a level (e.g., `Classical Technique`, `Jazz Harmony`).
- **Lesson**: Represents individual instructional units containing metadata (title, description, duration) and protected media asset references (video URL, PDF score URL).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Visitors can inspect curriculum structures and lesson metadata with sub-200ms page load times.
- **SC-002**: 100% of video streaming and PDF download requests from non-subscribers are blocked securely.
- **SC-003**: 100% of paywall restriction triggers display the Membership Upgrade modal within 100ms of user action.

---

## Assumptions

- Lesson metadata (titles, descriptions, durations) is intentionally public to encourage SEO indexing and visitor conversion.
- Active subscription status is calculated dynamically based on the user's active membership record.
