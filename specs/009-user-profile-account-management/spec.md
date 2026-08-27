# Feature Specification: User Profile & Account Management

**Feature Branch**: `009-user-profile-account-management`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: Student profile details (name, avatar, musical bio, skill level, preferred genres), active subscription status overview, security settings (password change), and notification preferences.

---

## User Scenarios & Testing

### User Story 1 - Profile Details & Musical Preferences (Priority: P1)

As a Piano Student, I want to edit my profile details (display name, avatar picture URL, musical bio, piano skill level, and favorite music genres) so that my profile reflects my personal identity and musical tastes.

**Why this priority**: Essential personalization feature for user identity across the platform.

**Independent Test**: Updating name, avatar, bio, skill level, and genres saves changes to backend and updates profile header instantly.

**Acceptance Scenarios**:
1. **Given** a student on the profile edit form (`/profile`), **When** they update name, avatar URL, bio, skill level ("Intermediate"), and select genres ("Jazz", "Gospel"), **Then** clicking "Save Profile" updates their profile header.
2. **Given** an invalid avatar URL, **When** rendered, **Then** the UI gracefully falls back to a warm rose default avatar icon.

---

### User Story 2 - Subscription Status & Membership Plan Overview (Priority: P2)

As a Subscriber, I want to review my active membership tier, renewal date, and billing history on my account dashboard so that I can track my subscription status.

**Why this priority**: Transparent billing management builds trust and reduces billing support queries.

**Independent Test**: Opening the Subscription tab displays active plan name, expiration/renewal date, currency price, and upgrade trigger button.

**Acceptance Scenarios**:
1. **Given** an active subscriber viewing the Subscription tab, **When** rendered, **Then** it shows plan tier (e.g. "Annual All-Access Membership"), status ("Active"), next billing date, and payment history.
2. **Given** an unauthenticated or non-subscribed user, **When** viewing the tab, **Then** it prompts them to choose a membership tier.

---

### User Story 3 - Account Security & Notification Preferences (Priority: P3)

As a Student, I want to change my password and manage notification preferences so that my account remains secure and I receive relevant learning updates.

**Why this priority**: Security baseline and customizable notification control.

**Independent Test**: Entering current password and matching new passwords updates the password successfully; toggling notification switches persists user preferences.

**Acceptance Scenarios**:
1. **Given** the Security tab, **When** a user enters valid current password and matching new passwords, **Then** the system updates the password and displays a success alert.
2. **Given** non-matching new passwords, **When** submitted, **Then** an error prompt ("New passwords do not match") is shown.

---

### Edge Cases

- **Weak Password Validation**: Passwords under 6 characters display a validation warning.
- **Form Dirty Guard**: Attempting to navigate away with unsaved profile edits prompts a confirmation dialog.

---

## Requirements

### Functional Requirements

- **FR-009-1**: The system MUST allow editing user profile details: Name, AvatarUrl, Bio, SkillLevel (`Beginner`, `Intermediate`, `Advanced`), and PreferredGenres.
- **FR-009-2**: The system MUST display current active subscription details (PlanName, Status, RenewalDate, PriceIDR/USD).
- **FR-009-3**: The system MUST support secure password change requiring current password verification.
- **FR-009-4**: The system MUST support customizable notification preferences (`PracticeReminders`, `MasterclassAlerts`, `ForumReplies`).
- **FR-009-5**: The system MUST provide profile API endpoints: `GET & PUT /api/user/profile`, `POST /api/user/change-password`, and `GET /api/user/subscription`.

### Key Entities

- **UserProfileDto**: UserId, Name, Email, AvatarUrl, Bio, SkillLevel, PreferredGenres, CreatedAt.
- **SubscriptionOverviewDto**: PlanName, Status, RenewalDate, PriceIDR, PriceUSD, IsActive.
- **ChangePasswordDto**: CurrentPassword, NewPassword, ConfirmPassword.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Profile updates sync to database and UI header in under 100 milliseconds.
- **SC-002**: Password change validation rejects 100% of invalid current passwords or mismatched new passwords.
- **SC-003**: Subscription overview displays 100% accurate billing renewal dates.

---

## Assumptions

- User authentication token is stored securely in localStorage or HTTP-only cookie.
