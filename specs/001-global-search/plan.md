# Technical Implementation Plan: SPEC-001 Global Navbar Search

**Module Directory**: `docs/specs/001-global-search`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices

* **Backend**: ASP.NET Core 10 Web API (`SearchController.cs`).
* **ORM Query Engine**: EF Core 10 `EF.Functions.ILike` pattern matching across indexed columns in PostgreSQL.
* **Frontend**: React Top Navbar component with custom `useDebounce` hook.

---

## 2. Codebase Architecture & Folder Structure

```text
backend/
├── Controllers/SearchController.cs       # REST API search endpoint
├── DTOs/
│   ├── SearchResponseDto.cs              # Grouped search results payload
│   └── SearchItemDto.cs                  # Generic result item representation
frontend/
├── src/components/common/NavbarSearch.jsx# Search bar UI component
├── src/hooks/useSearch.js                # Custom debounced search hook
```

---

## 3. API Contract & Database Flow

### 3.1 Endpoint Signature
* **HTTP Method**: `GET /api/search?q={query}&type={all|lesson|cover|sheet}`
* **Response DTO**:
```json
{
  "query": "Beethoven",
  "lessons": [
    { "id": 12, "title": "Moonlight Sonata Lesson 1", "thumbnail": "/img/lesson12.jpg", "type": "Lesson" }
  ],
  "covers": [
    { "id": 4, "title": "Moonlight Sonata Cover", "thumbnail": "/img/cover4.jpg", "type": "Cover" }
  ],
  "sheetMusic": [
    { "id": 8, "title": "Moonlight Sonata 1st Mvt PDF", "thumbnail": "/img/sheet8.jpg", "type": "SheetMusic", "priceIDR": 45000, "priceUSD": 2.99 }
  ]
}
```

### 3.2 SQL Index Optimization
```sql
CREATE INDEX idx_lessons_title_ilike ON "Lessons" USING gin (to_tsvector('english', "Title"));
CREATE INDEX idx_covers_title_ilike ON "CoverVideos" USING gin (to_tsvector('english', "Title"));
CREATE INDEX idx_sheetmusic_title_ilike ON "SheetMusic" USING gin (to_tsvector('english', "Title"));
```

---

## 4. Implementation Roadmap

1. **Step 1**: Implement `SearchController.cs` in backend with LINQ `ILike` queries.
2. **Step 2**: Add GIN/B-Tree database indexes to PostgreSQL via EF Core migration.
3. **Step 3**: Build `useDebounce` hook in React frontend.
4. **Step 4**: Build `NavbarSearch` overlay component with ARIA accessibility.
5. **Step 5**: Test response time under 200ms with 1,000 seeded items.
