# Quickstart & Validation Guide: Digital Sheet Music Store & Library

## End-to-End Validation Scenarios

### Scenario 1: Sheet Music Store Catalog & Filtering
1. Open web application (`http://localhost:5173`).
2. Navigate to "Sheet Music Store" (`/store`).
3. Apply filter `Gospel` or `Intermediate`.
4. Verify catalog cards update with localized IDR/USD prices.

### Scenario 2: Watermarked Score Preview
1. Click "Preview Score" on any sheet music item.
2. Verify preview modal opens displaying watermarked first-page sample.

### Scenario 3: Personal Library & Interactive Score Viewer
1. Navigate to "My Library" (`/my-library`).
2. Verify list of owned scores.
3. Click "Open Interactive Viewer".
4. Test zoom in (+), zoom out (-), and page turn controls.

## Build Verification Commands

```bash
# Frontend TypeScript & Vite build
cd frontend
npm run build

# Backend .NET API build
cd backend
dotnet build
```
