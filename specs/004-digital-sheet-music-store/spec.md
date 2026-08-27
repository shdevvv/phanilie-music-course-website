# Feature Specification: Digital Sheet Music Store & Personal Library

**Feature Branch**: `004-digital-sheet-music-store`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: Interactive digital sheet music store catalog (arrangements, difficulty levels, key signatures), watermarked first-page PDF score previews, single item a-la-carte purchases, personal digital library (`/my-library`), and interactive PDF score viewer.

---

## User Scenarios & Testing

### User Story 1 - Store Catalog & Watermarked Preview (Priority: P1)

As a Student or Music Lover, I want to browse the digital sheet music store filtered by difficulty, arrangement style, and key signatures so that I can preview sample watermarked scores before making a purchase.

**Why this priority**: Showcase sheet music catalog and allow buyers to inspect arrangement quality before purchasing.

**Independent Test**: Browsing `/store` displays sheet music cards with filters (`Beginner`, `Intermediate`, `Advanced`, `Gospel`, `Jazz`, `Classical`); clicking "Preview Score" renders a watermarked sample page.

**Acceptance Scenarios**:
1. **Given** any visitor on `/store`, **When** they apply filters (e.g. `Difficulty = Intermediate`, `Style = Gospel`), **Then** the grid displays matching sheet music scores with price, key signature, and page count.
2. **Given** a visitor selecting a sheet music item, **When** they click "Preview Score", **Then** a modal opens displaying a watermarked first-page PDF preview.

---

### User Story 2 - A-La-Carte Purchase & Instant Library Unlock (Priority: P2)

As a Registered Student, when I purchase an individual sheet music score (or hold an active subscription granting downloads), I want the item to be instantly unlocked and permanently added to my personal library (`/my-library`).

**Why this priority**: Core revenue stream allowing non-subscribers to buy standalone arrangements and subscribers to collect scores.

**Independent Test**: Completing checkout for a sheet music item instantly adds it to `UserLibrary` and redirects the user to `/my-library`.

**Acceptance Scenarios**:
1. **Given** a logged-in user on a sheet music detail page, **When** they click "Buy Sheet Music", **Then** an order is created and sent to the checkout gateway.
2. **Given** a completed sheet music order, **When** returned from payment, **Then** the score appears in `/my-library` with a "Download PDF" CTA.

---

### User Story 3 - Personal Library & Interactive Score Viewer (Priority: P3)

As a Student, I want to open my purchased sheet music in an interactive digital score viewer with zoom and page-turn controls so that I can practice directly on screen or download high-res PDF files.

**Why this priority**: Delivers convenient digital practice capability for desktop and tablet users.

**Independent Test**: Navigating to `/my-library` displays all unlocked scores; clicking "Open Score" launches the built-in PDF viewer with zoom in/out and page navigation.

**Acceptance Scenarios**:
1. **Given** an owner of a purchased sheet music score, **When** they navigate to `/my-library`, **Then** they see their owned scores sorted by purchase date.
2. **Given** an unlocked score in the viewer, **When** the user clicks Zoom In (`+`) or Next Page (`>`), **Then** the score view scales and navigates smoothly.

---

### Edge Cases

- **Unauthorized Download Attempt**: Attempting to access direct PDF download links for unpurchased scores returns HTTP 403 Forbidden.
- **Duplicate Purchase Guard**: If a user already owns a score, the "Buy" button is replaced with "In Your Library - Open Score".

---

## Requirements

### Functional Requirements

- **FR-004-1**: The system MUST render an interactive sheet music store catalog filterable by skill level (`Beginner`, `Intermediate`, `Advanced`), music genre (`Gospel`, `Jazz`, `Classical`), and key signature.
- **FR-004-2**: The system MUST provide a watermarked first-page preview for each sheet music item.
- **FR-004-3**: A-la-carte purchases MUST create a dedicated Order and upon payment completion populate the user's `UserLibrary` record.
- **FR-004-4**: The user's personal digital library (`/my-library`) MUST list all owned sheet music scores with search and sorting.
- **FR-004-5**: The interactive score viewer MUST support zoom scaling (50% to 200%), page navigation controls, and direct high-resolution PDF downloads for verified owners.

### Key Entities

- **SheetMusic**: Represents a digital score (Id, Title, Composer, Arranger, Difficulty, KeySignature, PageCount, PriceIDR, PriceUSD, PreviewPdfUrl, FullPdfUrl, ThumbnailUrl).
- **UserLibrary**: Links user ownership to purchased sheet music (Id, UserId, SheetMusicId, PurchasedAt).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Unlocked sheet music scores appear in `/my-library` within 1 second of payment completion.
- **SC-002**: Interactive PDF score viewer loads and renders page 1 in under 500 milliseconds.
- **SC-003**: 100% of unowned score download requests are blocked with HTTP 403.

---

## Assumptions

- Watermarked preview PDFs are generated statically or rendered with a watermark overlay.
- High-res PDF download links use secure signed token URLs.
