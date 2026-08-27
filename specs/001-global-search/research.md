# Research & Technical Decisions: Global Navbar Search

## 1. Debouncing & Input Handling Strategy

- **Decision**: Implement a custom 300ms `useDebounce` hook in Frontend React (`frontend/src/hooks/useDebounce.ts`).
- **Rationale**: Prevents sending an HTTP request on every single keystroke, reducing server load while providing responsive typing UX.
- **Alternatives Considered**: 
  - Lodash debounce: Rejected to avoid extra external library dependencies since custom hook is under 15 lines of code.

## 2. Recent Searches Storage Mechanism

- **Decision**: Use Browser `localStorage` under key `phanilie_recent_searches`.
- **Rationale**: Client-side storage is instant, requires zero backend API calls, and preserves user privacy across sessions.
- **Constraints**: Cap at maximum 5 items, sorted by most recent timestamp, deduplicated on insertion.

## 3. Categorized Search API & Query Strategy

- **Decision**: Single endpoint `GET /api/search?q={query}` in C# .NET API (`SearchController`).
- **Rationale**: Consolidating search into a single HTTP round-trip minimizes network overhead and latency.
- **Query Optimization**: Use database indexing (B-Tree/GIN index on Title, Artist, Composer fields) with `EF.Functions.Like` or ILIKE queries, limiting each category result set to max 20 items.

## 4. Mobile Layout & Keyboard Accessibility

- **Decision**: Responsive design switching between Inline Dropdown on desktop (`>= 768px`) and Fullscreen Overlay Modal on mobile (`< 768px`).
- **Rationale**: Fullscreen modal on mobile provides optimal touch targets, avoids cramped keyboard viewports, and prevents layout shifting.
- **Keyboard Navigation**: Standard `ArrowDown`, `ArrowUp`, `Enter`, and `Escape` key handlers attached to the search input container.
