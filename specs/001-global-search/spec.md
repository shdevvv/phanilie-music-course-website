# Feature Specification: 001 Global Navbar Search

**Feature Branch**: `001-global-search`  
**Created**: 2026-07-29  
**Status**: Approved Specification  
**Input**: Global navbar search bar, multi-category matching (Lessons, Cover Videos, Sheet Music), debounced inputs, keyboard accessibility, and empty query suggestions.  

---

## User Scenarios & Testing

### User Story 1 - Instant Global Navigation Search (Priority: P1)

As a Site Visitor or Music Student, when I type a song title, composer name, or lesson topic into the top navigation search bar, I want instant search matching across all catalog types so that I can quickly find relevant music content without navigating multiple pages.

**Why this priority**: Navigation search is the primary entry point for users looking for specific songs, arrangements, or tutorial lessons.

**Independent Test**: Typing "Beethoven" into the navbar search input displays top matching items from Video Lessons, Cover Videos, and Sheet Music arrangements within 300ms.

**Acceptance Scenarios**:
1. **Given** a user on any public or authenticated page, **When** they type a partial search term (e.g., "Moonlight") into the navbar input, **Then** an overlay dropdown displays matching Video Lessons, Performance Covers, and Sheet Music arrangements.
2. **Given** search input receiving keystrokes, **When** typing pauses for 300 milliseconds, **Then** the search query executes automatically without requiring the user to press an explicit submit button.

---

### User Story 2 - Categorized Results & Navigation (Priority: P2)

As a Sheet Music Buyer or Subscriber, I want search results organized into distinct categories (`Lessons`, `Performance Covers`, `Sheet Music`) with thumbnail previews and content badges so that I can distinguish between watchable videos and downloadable scores.

**Why this priority**: Differentiates video streaming content from e-commerce sheet music scores to prevent user confusion.

**Independent Test**: Search dropdown clearly displays distinct category headers, thumbnail images, content-type badges, and item prices/durations.

**Acceptance Scenarios**:
1. **Given** active search results displayed in the dropdown, **When** a user clicks on a Sheet Music result, **Then** the system navigates directly to that sheet music arrangement detail page.
2. **Given** active search results displayed in the dropdown, **When** a user clicks on a Lesson result, **Then** the system navigates directly to that lesson's curriculum player view.

---

### User Story 3 - Keyboard Navigation & Empty State Handling (Priority: P3)

As a Power User or Keyboard Navigator, I want to use `ArrowUp` / `ArrowDown` keys to navigate dropdown results and receive friendly search suggestions when no matching content is found.

**Why this priority**: Enhances accessibility, keyboard efficiency, and user satisfaction during non-matching queries.

**Independent Test**: Pressing down arrow moves visual selection highlight across dropdown items; typing an unmatchable query renders friendly search suggestions.

**Acceptance Scenarios**:
1. **Given** an open search dropdown, **When** the user presses `ArrowDown` or `ArrowUp` keys, **Then** active focus highlight moves sequentially across items and pressing `Enter` selects the highlighted item.
2. **Given** a query with zero catalog matches (e.g., "xyz123unmatchable"), **When** search completes, **Then** the dropdown displays "No matching music content found" alongside suggested popular search categories.

---

### Edge Cases
- **Special Character Input**: What happens when a user types symbols (e.g., `#`, `%`, `*`)? Input parsing MUST sanitize special characters without causing search errors.
- **Rapid Clearing**: How does the system handle rapid clearing of search input? Clearing the search text MUST instantly close the dropdown overlay.

---

## Requirements

### Functional Requirements

- **FR-001-1**: The search input MUST be accessible from the top navigation bar across all device viewports.
- **FR-001-2**: Search queries MUST perform real-time, case-insensitive partial string matching across:
  - Course Lesson titles and topic descriptions.
  - Performance Cover video titles and song artist names.
  - Sheet Music arrangement titles, composer names, and genres.
- **FR-001-3**: Search execution MUST be debounced by 300 milliseconds to optimize performance.
- **FR-001-4**: Results MUST be categorized into three distinct groups: `Lessons`, `Performance Covers`, and `Sheet Music`.
- **FR-001-5**: Each result item MUST display a thumbnail preview, title, secondary metadata (e.g., Difficulty or Price), and a content-type badge.
- **FR-001-6**: Results per category MUST be capped at a maximum of 20 items per query.

### Key Entities

- **SearchQuery**: Represents the debounced input string provided by the user.
- **SearchResultGroup**: Represents categorized collections of matching entities (`Lessons`, `Covers`, `SheetMusic`) containing thumbnail, title, route link, and content-type metadata.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can discover and navigate to desired music content within 3 seconds of typing a query.
- **SC-002**: 95% of search queries return formatted results in under 200 milliseconds.
- **SC-003**: Keyboard navigation permits 100% mouse-free selection of search dropdown items.

---

## Assumptions

- Search operates across published catalog content accessible to the user's role.
- Search overlay closes automatically when clicking outside the dropdown container.
