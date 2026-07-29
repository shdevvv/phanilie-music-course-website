# Feature Specification: 000 Core Database Infrastructure & Initial Data Seeding

**Feature Branch**: `000-core-database-infrastructure`  
**Created**: 2026-07-29  
**Status**: Approved Specification  
**Input**: Core database infrastructure, EF Core migrations, Super Admin auto-seeding, membership plans, and achievement badges.  

---

## User Scenarios & Testing

### User Story 1 - Automatic Database Migration & Super Admin Seeding (Priority: P1)

As a System Administrator or Deployment Engineer, when the backend API launches for the first time, I want PostgreSQL database schemas created automatically and populated with a default Super Admin account so that the system is instantly operational without manual database setup scripts.

**Why this priority**: Without database initialization and admin seeding, zero system features can operate and managers cannot log into administrative control panels.

**Independent Test**: Can be fully tested by launching the API against a fresh PostgreSQL instance and verifying table creation alongside logging in with the seeded Super Admin credentials (`admin@phanilie.com`).

**Acceptance Scenarios**:
1. **Given** a fresh PostgreSQL database instance with no existing tables, **When** the backend API initializes on startup, **Then** all relational schemas are created and the Super Admin user (`admin@phanilie.com`) is seeded into the database.
2. **Given** an existing database with applied migrations, **When** the backend API starts up, **Then** existing administrative credentials and operational records remain untouched without duplicate seeding.

---

### User Story 2 - Default Membership Tier Seeding (Priority: P2)

As a Visitor or Student exploring subscription plans, I want baseline membership tiers (`Monthly`, `Quarterly`, `Annual`) available out of the box with dual-currency pricing (IDR & USD) so that I can inspect and purchase subscriptions immediately.

**Why this priority**: Monetization and paywall functionality depend on predefined subscription plan definitions.

**Independent Test**: Querying the membership plans endpoint returns active `Monthly`, `Quarterly`, and `Annual` plan definitions with `Price_IDR` and `Price_USD` values.

**Acceptance Scenarios**:
1. **Given** an empty `MembershipPlans` table, **When** the system initializer runs, **Then** default plans (`Monthly`, `Quarterly`, `Annual`) are populated with valid IDR and USD pricing.

---

### User Story 3 - System Achievement Badge Seeding (Priority: P3)

As a Music Learner, I want initial achievement badges (`First Song Mastered`, `Dedicated Learner`, `Practice Enthusiast`, `Weekly Warrior`) seeded in the database so that my learning progress triggers reward milestones.

**Why this priority**: Enables gamification and student practice tracking.

**Independent Test**: Querying the system badges table confirms baseline badge definitions with title, description, and milestone threshold metadata.

**Acceptance Scenarios**:
1. **Given** an empty `Badges` table, **When** the system initializer runs, **Then** default system badges are seeded into the database.

---

### Edge Cases
- **Database Connection Failure**: What happens when the database connection string is invalid? The API MUST log an explicit database error and terminate startup safely to prevent partial operations.
- **Concurrent API Instances**: How does the system handle multiple backend instances launching simultaneously? Migration locks MUST prevent concurrent migration conflicts.

---

## Requirements

### Functional Requirements

- **FR-000-1**: The system MUST automatically detect and apply pending database schema migrations on API startup.
- **FR-000-2**: The system MUST inspect the `Users` table and seed a Super Admin user (`admin@phanilie.com`) if no admin user exists.
- **FR-000-3**: The system MUST seed default `Monthly` (149k IDR / $9.99), `Quarterly` (399k IDR / $26.99), and `Annual` (1.299M IDR / $89.99) plans if the plans table is empty.
- **FR-000-4**: The system MUST seed default Achievement Badges (`First Song Mastered`, `Dedicated Learner`, `Practice Enthusiast`, `Weekly Warrior`) if the badges table is empty.

### Key Entities

- **User**: Represents user accounts, storing credentials, role (`Admin`/`Subscriber`/`Student`), country code, and currency preference.
- **MembershipPlan**: Represents subscription tiers with dual-currency pricing (`Price_IDR`, `Price_USD`) and duration.
- **Badge**: Represents system achievement badge metadata with title, description, icon URL, and unlocking threshold criteria.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Database schema migrations and data seeding complete within 3 seconds during API startup.
- **SC-002**: 100% of newly deployed API environments possess operational Super Admin credentials out of the box.
- **SC-003**: 100% of fresh installations populate active membership plans and achievement badge metadata automatically.

---

## Assumptions

- PostgreSQL database instance is accessible via environment connection string.
- Initial seed data provides baseline defaults that can later be edited by Administrators.
