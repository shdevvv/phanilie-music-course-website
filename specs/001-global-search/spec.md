# Feature Specification: 001 - Global Navbar Search Bar

**Feature Directory**: `specs/001-global-search`
**Created**: 2026-07-29
**Status**: Approved

## User Scenarios & Testing

### User Story 1 - Instant Navigation Bar Search (Priority: P1)

As a site visitor or student, I want to search across lesson videos, cover titles, and sheet music titles from the top navigation bar so that I can quickly find relevant music content.

## Requirements

### Functional Requirements
- **FR-001**: System MUST provide a `GET /api/search?q={query}&type={all|lesson|cover|sheet}` endpoint.
- **FR-002**: Search MUST perform case-insensitive partial matching on Lesson titles, Cover titles, and Sheet Music titles.
- **FR-003**: Search results MUST be paginated and capped at a maximum limit (default 20 items per category).
