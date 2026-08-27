# Data Model: Global Navbar Search

## Entities & Data Contracts

### 1. SearchQuery (Value Object)
- **query** (`string`): Raw search query string typed by the user.
- **Validation**:
  - Minimum length: 2 characters (queries < 2 chars return empty results without calling API).
  - Maximum length: 100 characters.
  - Sanitization: Strip dangerous script tags and special control characters (`<`, `>`, `%`, `\0`).

### 2. SearchResultItem (DTO)
- **id** (`string`): Unique identifier of the catalog entity.
- **title** (`string`): Display title of the lesson, cover, or sheet music.
- **category** (`"Lesson" | "Performance Cover" | "Sheet Music"`): Category discriminator.
- **subtitle** (`string`): Secondary metadata (e.g. Composer name, Artist, or Instructor).
- **thumbnailUrl** (`string`): Preview image URL for video/sheet thumbnail.
- **badgeText** (`string`): Badge descriptor (e.g., "Intermediate", "PDF Score", "Video Lesson").
- **priceOrDuration** (`string`): Additional context (e.g. "$12.00" or "14 mins").
- **routeUrl** (`string`): Frontend destination route (e.g. `/sheets/123`, `/courses/456`).

### 3. SearchResponse (DTO)
- **query** (`string`): Echo of sanitized search query string.
- **totalCount** (`number`): Total count of matching items across all categories.
- **lessons** (`SearchResultItem[]`): Array of matching Video Lessons (max 20).
- **covers** (`SearchResultItem[]`): Array of matching Performance Cover Videos (max 20).
- **sheetMusic** (`SearchResultItem[]`): Array of matching Sheet Music score arrangements (max 20).

### 4. RecentSearch (Local Entity)
- **term** (`string`): Previously searched term.
- **timestamp** (`number`): Epoch millisecond timestamp of search execution.
- **Storage**: Saved in `localStorage` under `phanilie_recent_searches` (array capped at 5 items).
