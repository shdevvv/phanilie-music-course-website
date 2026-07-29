# Feature Specification: 002 - Freemium Course Exploration & Access Control

**Feature Directory**: `specs/002-freemium-course-exploration`
**Created**: 2026-07-29
**Status**: Approved

## User Scenarios & Testing

### User Story 1 - Public Course Tree Browsing & Paywall Guard (Priority: P1)

As a non-member guest, I want to click "Start Learning Now" from the homepage, land on the `/courses` page, and freely explore levels, topics, and lesson details, but get prompted with membership plans when attempting to watch video lessons or download PDFs.

## Requirements

### Functional Requirements
- **FR-001**: `GET /api/courses` MUST be public.
- **FR-002**: `GET /api/lessons/{id}/media` MUST enforce active subscriber authorization.
- **FR-003**: System MUST return membership plan details in the `403 Forbidden` paywall response.
