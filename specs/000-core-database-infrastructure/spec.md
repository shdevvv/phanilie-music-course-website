# Feature Specification: Core Database Infrastructure & Initial Data Seeding

**Feature Branch**: `000-core-database-infrastructure`

**Created**: 2026-07-29

**Status**: Approved Specification

**Input**: User description: "baca folder docs/specs/000-core-database-infrastructure/spec.md"

## Clarifications

### Session 2026-07-29

- Q: How should the Super Admin initial password be configured during database seeding? → A: Seed Super Admin with default credentials `admin@phanilie.com` and initial password `Admin@Phanilie2026!`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Database Migration & Super Admin Seeding (Priority: P1)

As a System Administrator or Deployment Engineer, when the system launches for the first time, I want relational database schemas created automatically and populated with a default Super Admin account so that the platform is instantly operational without manual database setup scripts.

**Why this priority**: Without database initialization and admin seeding, zero system features can operate and managers cannot log into administrative control panels.

**Independent Test**: Can be fully tested by launching the system against a clean database instance and verifying table creation alongside logging in with the seeded Super Admin credentials (`admin@phanilie.com` / `Admin@Phanilie2026!`).

**Acceptance Scenarios**:

1. **Given** a clean database instance with no existing tables, **When** the backend API initializes on startup, **Then** all relational schemas are created and the Super Admin user (`admin@phanilie.com`) is seeded into the database with initial password `Admin@Phanilie2026!`.
2. **Given** an existing database with applied migrations, **When** the backend API starts up, **Then** existing administrative credentials and operational records remain untouched without duplicate seeding.

---

### User Story 2 - Default Membership Tier Seeding (Priority: P2)

As a Visitor or Student exploring subscription plans, I want baseline membership tiers (`Monthly`, `Quarterly`, `Annual`) available out of the box with dual-currency pricing (IDR & USD) so that I can inspect and purchase subscriptions immediately.

**Why this priority**: Monetization and paywall functionality depend on predefined subscription plan definitions.

**Independent Test**: Querying the membership plans catalog returns active `Monthly`, `Quarterly`, and `Annual` plan definitions with valid IDR and USD pricing structures.

**Acceptance Scenarios**:

1. **Given** an empty membership plans catalog, **When** the system initializer runs, **Then** default plans (`Monthly`, `Quarterly`, `Annual`) are populated with valid IDR and USD pricing.

---

### User Story 3 - System Achievement Badge Seeding (Priority: P3)

As a Music Learner, I want initial achievement badges (`First Song Mastered`, `Dedicated Learner`, `Practice Enthusiast`, `Weekly Warrior`) seeded in the database so that my learning progress triggers reward milestones.

**Why this priority**: Enables gamification and student practice tracking.

**Independent Test**: Querying the system badges repository confirms baseline badge definitions with title, description, and milestone threshold metadata.

**Acceptance Scenarios**:

1. **Given** an empty achievement badges catalog, **When** the system initializer runs, **Then** default system badges are seeded into the database.

---

### Edge Cases

- **Database Connection Failure**: What happens when the database connection string is invalid? The system MUST log an explicit error and terminate startup safely to prevent partial or corrupted operations.
- **Concurrent System Instances**: How does the system handle multiple backend instances launching simultaneously? Migration locks MUST prevent concurrent migration conflicts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-000-1**: The system MUST automatically detect and apply pending database schema migrations on API startup.
- **FR-000-2**: The system MUST inspect the user repository and seed a Super Admin user (`admin@phanilie.com` with password `Admin@Phanilie2026!`) if no admin user exists.
- **FR-000-3**: The system MUST seed default `Monthly` (149,000 IDR / $9.99 USD), `Quarterly` (399,000 IDR / $26.99 USD), and `Annual` (1,299,000 IDR / $89.99 USD) plans if the plans catalog is empty.
- **FR-000-4**: The system MUST seed default Achievement Badges (`First Song Mastered`, `Dedicated Learner`, `Practice Enthusiast`, `Weekly Warrior`) if the badges catalog is empty.

### Key Entities *(include if feature involves data)*

- **User**: Represents user accounts, storing credentials (hashed), role (`Admin`, `Subscriber`, `Student`), country code, and currency preference.
- **MembershipPlan**: Represents subscription tiers with dual-currency pricing (`Price_IDR`, `Price_USD`) and billing cycle duration.
- **Badge**: Represents system achievement badge metadata with title, description, icon asset reference, and unlocking threshold criteria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Database schema migrations and data seeding complete within 3 seconds during API startup.
- **SC-002**: 100% of newly deployed application environments possess operational Super Admin credentials out of the box (`admin@phanilie.com` / `Admin@Phanilie2026!`).
- **SC-003**: 100% of fresh installations populate active membership plans and achievement badge metadata automatically.

## Assumptions

- Database service is accessible via environment connection string configuration.
- Initial seed data provides baseline defaults that can later be edited by system Administrators.
