# Feature Specification: Community Discussion Forums

**Feature Branch**: `007-community-discussion-forums`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: Community discussion forum threads, categorized channels (`Technique`, `Repertoire`, `Equipment`, `General`), thread creation modal, nested replies feed, post upvoting, content moderation reporting/flagging, and author reputation badges.

---

## User Scenarios & Testing

### User Story 1 - Forum Category Channel Browsing (Priority: P1)

As a Piano Student, I want to browse discussion threads filtered by specific channels (`Technique`, `Repertoire`, `Equipment`, `General`) so that I can quickly find relevant peer discussions and learning advice.

**Why this priority**: Core navigation hub for student community interaction and peer knowledge sharing.

**Independent Test**: Clicking channel filter tabs (`Technique`, `Repertoire`, `Equipment`) filters the main thread feed in real-time.

**Acceptance Scenarios**:
1. **Given** a student on the forum hub (`/forums`), **When** they click the "Technique" category tab, **Then** only threads tagged with `Technique` are rendered.
2. **Given** the main thread feed, **When** viewed, **Then** each post card displays author avatar, name, creation date, category badge, total upvotes, and total reply count.

---

### User Story 2 - Thread Creation & Discussion Replies (Priority: P2)

As a Student, I want to create new discussion topics and post replies on existing threads so that I can ask questions and discuss piano concepts with fellow learners.

**Why this priority**: Enables active community engagement and student Q&A interactions.

**Independent Test**: Submitting a new thread form adds the topic to the main feed; submitting a reply under a thread appends the comment to the discussion thread view.

**Acceptance Scenarios**:
1. **Given** a student opening the "New Thread" modal, **When** they enter title, select channel, write post content, and click submit, **Then** the thread appears at the top of the forum feed.
2. **Given** a thread detail view (`/forum-thread`), **When** a user submits a reply text, **Then** the reply counter increments and the comment is appended.

---

### User Story 3 - Upvoting & Moderation Flagging (Priority: P3)

As a Student, I want to upvote helpful answers and report inappropriate or spam posts so that high-quality content rises to the top and community guidelines are maintained.

**Why this priority**: Maintains community quality, rewards helpful contributors, and mitigates spam.

**Independent Test**: Clicking the upvote icon increments the vote counter by 1; clicking "Report" opens a flag modal with reason options (`Spam`, `Harassment`, `Inappropriate`).

**Acceptance Scenarios**:
1. **Given** a discussion post, **When** a student clicks the Upvote button, **Then** the post upvote count increments by 1 in real-time.
2. **Given** an inappropriate post, **When** a student clicks "Report", selects a reason, and submits, **Then** a confirmation alert is displayed and the report is queued for moderation.

---

### Edge Cases

- **Empty Post Validation**: Attempting to submit a thread without a title or body text displays a validation error prompt ("Title and content cannot be blank").
- **Duplicate Upvoting**: Clicking upvote on an already upvoted thread toggles the vote (removes upvote and decrements count).

---

## Requirements

### Functional Requirements

- **FR-007-1**: The system MUST provide category channels (`All`, `Technique`, `Repertoire`, `Equipment`, `General`).
- **FR-007-2**: The system MUST support creating new discussion threads with title, category channel, and body content.
- **FR-007-3**: The system MUST support posting replies to existing discussion threads.
- **FR-007-4**: The system MUST support upvoting and un-upvoting forum posts/replies.
- **FR-007-5**: The system MUST provide a moderation reporting modal allowing users to flag inappropriate content.
- **FR-007-6**: The system MUST return threads and replies via `GET /api/forum/threads`, `POST /api/forum/threads`, and `POST /api/forum/threads/{id}/replies`.

### Key Entities

- **ForumThread**: Represents a discussion thread (Id, UserId, AuthorName, AvatarUrl, Title, Category, Content, Upvotes, CreatedAt).
- **ForumReply**: Represents a reply comment (Id, ThreadId, UserId, AuthorName, AvatarUrl, Content, Upvotes, CreatedAt).
- **ForumReport**: Tracks content moderation flags (Id, ThreadId, ReporterUserId, Reason, CreatedAt).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Category filtering updates feed in under 50 milliseconds.
- **SC-002**: Thread and reply creations update discussion views immediately (100% responsiveness).
- **SC-003**: 0% loss of user report flags.

---

## Assumptions

- Forum posts and replies are accessible to all registered users.
- Initial seed threads are loaded for demo presentation.
