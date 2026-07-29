# Feature Specification: 005 - Newsletter Email Subscription

**Feature Directory**: `specs/005-newsletter-subscription`
**Created**: 2026-07-29
**Status**: Approved

## Requirements
- **FR-001**: `POST /api/newsletter` MUST validate email format and check for duplicates.
- **FR-002**: System MUST store subscriber email in `NewsletterSubscriptions` with unsubscribe token.
