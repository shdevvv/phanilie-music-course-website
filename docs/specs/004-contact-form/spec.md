# Feature Specification: 004 - Contact Phanilie Footer Form

**Feature Directory**: `specs/004-contact-form`
**Created**: 2026-07-29
**Status**: Approved

## Requirements
- **FR-001**: `POST /api/contact` MUST validate email syntax, name, and message body.
- **FR-002**: System MUST save submissions into `ContactMessages` table.
- **FR-003**: System MUST enforce anti-spam rate limiting.
