# Quickstart Validation Guide: Shopping Cart & Guest Sync

**Module**: `SPEC-010 Shopping Cart & Guest Sync`  
**Date**: 2026-08-11  

---

## 1. Overview & Setup Prerequisites

This quickstart guide validates the end-to-end behavior of the Shopping Cart drawer, HTTP-only guest session cookie persistence, post-login overwrite cart sync, dialog modal prompt, and dual-currency formatting.

### Prerequisites
- Backend API running at `http://localhost:5000` (or `http://localhost:5181`)
- Frontend Dev Server running at `http://localhost:5173`
- SQLite / PostgreSQL database seeded with active Sheet Music catalog items

---

## 2. Test Scenarios & Step-by-Step Verification

### Scenario A: Unauthenticated Guest Cart & Confirmation Modal Flow
1. Open browser in Guest / Incognito mode at `http://localhost:5173/covers-sheets`.
2. Locate a sheet music item (e.g., *"Chopin Fantaisie-Impromptu"*) and click **"Add to Cart"**.
3. **Expected Outcome**:
   - A confirmation dialog modal opens displaying item details, thumbnail, price in active currency, and two buttons: `"View Cart"` and `"Continue Shopping"`.
   - The navbar cart badge counter increments to `1`.
   - Inspection of browser cookies reveals `phanilie_guest_session` HTTP-only cookie set.
4. Click `"Continue Shopping"` -> Modal closes. Add a second sheet music item.
5. Click `"View Cart"` -> Slide-out cart drawer opens displaying both items, unit prices, quantity toggles, and total subtotal.

---

### Scenario B: Guest Cart Sync upon Login (Overwrite Strategy)
1. Ensure guest cart contains **Item A** (Quantity: 1) and **Item B** (Quantity: 2).
2. Click **"Sign In"** in navbar -> Log into an existing student account (`student@phaniliemusic.com`) whose pre-existing database cart already contained **Item A** (Quantity: 3).
3. **Expected Outcome**:
   - `POST /api/cart/sync` is triggered automatically upon successful authentication.
   - For overlapping **Item A**, the account cart quantity is overwritten by the guest cart quantity (`1`).
   - Non-overlapping **Item B** is merged into the account cart.
   - The `phanilie_guest_session` cookie is cleared (`Max-Age=0`).
   - Opening the cart drawer displays the unified account cart (**Item A**: 1, **Item B**: 2).

---

### Scenario C: Currency Preference Toggle (IDR / USD)
1. Open cart drawer containing sheet music items.
2. Toggle the currency selector from `IDR` to `USD`.
3. **Expected Outcome**:
   - All line item prices reformat from `Rp X.XXX` to `$X.XX`.
   - Cart subtotal recalculates in USD.
   - Proceeding to checkout (`/checkout`) passes selected items with USD pricing locked.

---

### Scenario D: Sync Failure Recovery Verification
1. Simulate a backend 500 error on `POST /api/cart/sync` (e.g., via dev tools network throttling/interception).
2. Log into student account as a guest with items in cart.
3. **Expected Outcome**:
   - A non-blocking toast warning appears: *"Cart synchronization failed. Retrying on next page load."*
   - The guest session cookie is preserved.
   - Navigating to another page retries `POST /api/cart/sync` successfully once the server responds normally.

---

## 3. Automated Command Verification

```bash
# Run backend unit tests for CartService & Sync logic
dotnet test backend/BackendAPI.csproj --filter "FullyQualifiedName~CartServiceTests"

# Run frontend E2E / component tests for CartDrawer & Modal
cd frontend && npm test -- src/components/CartDrawer.test.tsx
```
