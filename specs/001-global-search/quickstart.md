# Quickstart & Validation Guide: Global Navbar Search

## End-to-End Validation Scenarios

### Scenario 1: Debounced Search & Categorized Overlay
1. Open the web app in browser (`http://localhost:5173`).
2. Click on the search bar in top navigation.
3. Type "Beethoven" rapidly.
4. Verify that search execution waits 300ms after last keystroke before querying backend.
5. Verify dropdown opens with 3 category sections (`Lessons`, `Performance Covers`, `Sheet Music`).
6. Verify clicking a result item navigates to the target detail page.

### Scenario 2: Minimum Character Guard & Empty State
1. Type a single character "a" into the search bar.
2. Verify no API request is sent and dropdown remains closed or shows recent searches.
3. Clear input and focus empty search bar.
4. Verify up to 5 recent search terms appear under "Recent Searches".

### Scenario 3: Keyboard Accessibility
1. Focus search bar and type "Jazz".
2. Press `ArrowDown` key to highlight first item in dropdown.
3. Press `ArrowDown` multiple times to move highlight down.
4. Press `ArrowUp` to move highlight back up.
5. Press `Enter` on a highlighted item and verify navigation.
6. Press `Escape` to close dropdown.

## Automated Testing Verification Commands

```bash
# Frontend component tests & linting
cd frontend
npm run lint
npm run build

# Backend unit/integration tests
cd backend
dotnet test
```
