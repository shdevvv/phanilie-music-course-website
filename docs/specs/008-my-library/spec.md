# Feature Specification: 008 - My Library & PDF Watermarking

**Feature Directory**: `specs/008-my-library`
**Created**: 2026-07-29
**Status**: Approved

## Requirements
- **FR-001**: `GET /api/my-library` MUST list all sheet music items purchased by the user.
- **FR-002**: `GET /api/my-library/{id}/download` MUST dynamically stamp a bottom watermark on the PDF: *"Purchased by [Name] ([Email]) on Phanilie Music"*.
