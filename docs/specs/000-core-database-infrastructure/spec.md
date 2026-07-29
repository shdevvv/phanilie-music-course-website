# Feature Specification: 000 - Core Database Infrastructure & Data Seeding

**Feature Directory**: `specs/000-core-database-infrastructure`
**Created**: 2026-07-29
**Status**: Approved

## User Scenarios & Testing

### User Story 1 - Automatic Database Initializer & Super Admin Seeding (Priority: P1)

As a system engineer/administrator, when the backend API launches for the first time, I want PostgreSQL database tables created automatically via EF Core migrations and populated with default seed data (Super Admin account, default Membership Plans, and baseline Achievement Badges).

## Requirements

### Functional Requirements
- **FR-001**: System MUST configure `AppDbContext` with EF Core 10 PostgreSQL provider (`Npgsql`).
- **FR-002**: System MUST automatically apply pending database migrations on startup.
- **FR-003**: System MUST seed default Super Admin account (`admin@phanilie.com`), default membership plans (`Monthly`, `Quarterly`, `Annual`), and baseline badges if database is empty.
