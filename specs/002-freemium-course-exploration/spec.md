# Feature Specification: Freemium Course Exploration

**Feature Branch**: `002-freemium-course-exploration`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: Public course tree browsing, topic/lesson curriculum metadata, paywall guard middleware on restricted media (full video streaming and downloadable lesson PDF scores), and membership upgrade modal trigger.

---

## Clarifications

### Session 2026-08-06
- Q: Are there any free preview lessons available to non-subscribers? → A: No free preview lessons. ALL video lesson streaming and downloadable sheet music PDFs require an active paid subscription (`IsSubscribed = true` and `SubscriptionExpiresAt > Now`).
- Q: What is the navigation flow when clicking "Subscribe Now" on the Membership Modal? → A: Unauthenticated guests are redirected to Sign In / Sign Up first before proceeding to membership checkout; authenticated users proceed directly to Checkout.

---

## User Scenarios & Testing

### User Story 1 - Public Course Tree & Lesson Catalog Browsing (Priority: P1)

As a Site Visitor or Registered Student, I want to browse the complete course tree organized by skill levels (Beginner, Intermediate, Advanced) and topics so that I can inspect lesson titles, descriptions, durations, and curriculum structures before deciding to subscribe.

**Why this priority**: Public catalog browsing is the core top-of-funnel experience for acquiring new students and showcasing platform value.

**Independent Test**: Browsing `/courses` displays all published courses, topic modules, and lesson lists with complete metadata without requiring user authentication.

**Acceptance Scenarios**:
1. **Given** any visitor on the platform, **When** they navigate to the `/courses` curriculum page, **Then** they see organized course cards filtered by skill levels (`Beginner`, `Intermediate`, `Advanced`).
2. **Given** a visitor selecting a course, **When** they expand a topic module, **Then** they can view all lesson titles, estimated durations, difficulty badges, and lesson summaries.

---

### User Story 2 - Paywall Lock & Upgrade Modal Trigger (Priority: P2)

As a Free Student or Non-Member Visitor, when I click to watch any lesson video or download a lesson PDF score, I want the system to protect the premium content and show a clear Membership Plan upgrade prompt so that I can easily choose a subscription plan to unlock access.

**Why this priority**: Protects digital intellectual property and drives conversion from free visitors to paying subscribers.

**Independent Test**: Clicking any lesson video or PDF download as a non-subscriber blocks media playback, returns HTTP 403, and opens the Membership Upgrade Modal with dual-currency pricing (IDR/USD).

**Acceptance Scenarios**:
1. **Given** a non-subscriber (guest or free user) viewing a lesson, **When** they click "Watch Video" or "Download PDF Score", **Then** playback is blocked and the Membership Plan Upgrade Modal opens overlaying the page.
2. **Given** an unauthenticated guest clicking "Subscribe Now", **When** action is triggered, **Then** the user is redirected to the Sign In / Sign Up view before proceeding to Checkout.
3. **Given** a logged-in free user clicking "Subscribe Now", **When** action is triggered, **Then** they proceed directly to the Membership Checkout view.

---

### User Story 3 - Unrestricted Subscriber Content Access (Priority: P3)

As an Active Subscriber, when I open any lesson in the curriculum, I want instant access to stream full HD lesson videos and download accompanying sheet music PDFs without encountering paywalls.

**Why this priority**: Delivers core subscription value and smooth learning experience for paid members.

**Independent Test**: Logged-in active subscriber opens any lesson video or PDF download link and media plays/downloads immediately.

**Acceptance Scenarios**:
1. **Given** a logged-in user with an active subscription (`IsSubscribed = true`), **When** they access any lesson, **Then** full HD video streaming initializes immediately without paywall overlays.
2. **Given** an active subscriber on a lesson page, **When** they click "Download Lesson PDF", **Then** the sheet music score PDF opens/downloads directly.

---

### Edge Cases

- **Expired Subscription**: When a user whose subscription expired attempts to play a lesson video, the backend rejects access (`403 Forbidden`) and the UI displays a "Subscription Expired - Renew Access" overlay.
- **Unpublished / Draft Course**: Attempting to access an unpublished course or lesson URL directly returns a clean 404 Not Found response.

---

## Requirements

### Functional Requirements

- **FR-002-1**: The system MUST render a public course tree hierarchy organized by Course Levels (`Beginner`, `Intermediate`, `Advanced`), Topics, and Lessons.
- **FR-002-2**: Lesson metadata (title, summary, duration, difficulty, topic name, thumbnail) MUST be publicly accessible to all users.
- **FR-002-3**: ALL full HD video streaming streams and lesson PDF score downloads MUST be protected by a Paywall Guard requiring an active subscription (`IsSubscribed = true` and `SubscriptionExpiresAt > Now`).
- **FR-002-4**: Unauthorized media access attempts MUST return HTTP 403 Forbidden and trigger the Membership Plan Upgrade Modal on the frontend.
- **FR-002-5**: Unauthenticated users clicking "Subscribe Now" MUST be routed to Sign In / Sign Up first, while authenticated users MUST proceed directly to Membership Checkout.

### Key Entities

- **Course**: Represents a complete curriculum track (Level, Title, Description, Thumbnail).
- **Topic**: Represents a module section within a course (CourseId, Title, SequenceOrder).
- **Lesson**: Represents an individual learning lesson (TopicId, Title, Summary, VideoUrl, PdfUrl, DurationMinutes).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of visitors can browse the full public course tree and lesson metadata without login friction.
- **SC-002**: 100% of unauthorized media requests (non-subscribers) are blocked by the Paywall Guard within 50 milliseconds.
- **SC-003**: Active subscribers can start video playback within 2 seconds of clicking play.

---

## Assumptions

- There are NO free preview lesson videos; ALL media content requires an active paid subscription.
- All media assets (videos/PDFs) are securely served via signed URLs or media guard endpoints.
