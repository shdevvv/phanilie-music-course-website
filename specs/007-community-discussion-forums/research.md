# Research & Technical Decisions: Community Discussion Forums

## 1. Channel Filter & Thread State Management

- **Decision**: Filter state `selectedCategory` (`All` | `Technique` | `Repertoire` | `Equipment` | `General`).
- **Feed Render**: `forumApi.ts` client fetching threads and filtering locally / via API query.

## 2. Interactive Thread & Reply System

- **Decision**: `ForumThreadCard.tsx`, `CreateThreadModal.tsx`, `ReportThreadModal.tsx`.
- **Upvote Logic**: Client-side optimistic update with backend API sync (`POST /api/forum/threads/{id}/upvote`).

## 3. Moderation Flagging

- **Decision**: Modal dialog allowing user to submit report with options (`Spam`, `Harassment`, `Inappropriate Content`).
