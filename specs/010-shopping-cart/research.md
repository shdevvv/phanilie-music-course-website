# Research & Design Decisions: Shopping Cart & Guest Sync

**Module**: `SPEC-010 Shopping Cart & Guest Sync`  
**Date**: 2026-08-11  
**Status**: Completed Research Phase  

---

## 1. Guest Session Persistence & Cookie Architecture

### Question / Problem Statement
How should unauthenticated guest cart items be persisted on the client while satisfying the requirement for HTTP-only cookie security and reliable cross-tab persistence?

### Research Findings & Alternatives Evaluated
1. **Raw Payload in HTTP-Only Cookie**:
   - *Pros*: Completely stateless on backend.
   - *Cons*: Subject to 4KB browser cookie size limits; parsing complex JSON arrays in HTTP headers introduces payload bloat.
2. **Client-side `localStorage`**:
   - *Pros*: Simple client-side access.
   - *Cons*: Deviates from clarified user preference (HTTP-Only Guest Cookie requirement).
3. **Guest Session GUID Cookie + Backend Guest Cart Table (Chosen)**:
   - *Pros*: The client receives an HTTP-only, `SameSite=Lax` cookie `phanilie_guest_session` containing a cryptographically secure GUID. The backend persists guest cart line items in a temporary `GuestCartItems` table. Fully supports cross-tab persistence, zero cookie payload size issues, and secure seamless migration upon login.
   - *Cons*: Requires minor database storage for unauthenticated cart items (cleaned up via background TTL / auto-purge after 30 days).

### Final Decision & Rationale
**Selected Approach**: Guest Session GUID Cookie (`phanilie_guest_session`) mapped to backend `GuestCartItems` records.  
**Rationale**: Adheres to the HTTP-only cookie clarification, handles unlimited item counts safely, and allows the backend to perform atomic cart merges upon login.

---

## 2. Post-Login Cart Synchronization & Overwrite Merge Strategy

### Question / Problem Statement
How should the system merge guest cart items into an authenticated user's account cart upon login/registration, specifically enforcing the user-selected **Overwrite** merge rule for duplicate items?

### Research Findings & Alternatives Evaluated
1. **Client-Driven Sequential PUT Requests**:
   - *Pros*: Uses existing single-item endpoints.
   - *Cons*: Multiple HTTP network round-trips; partial failure leaves cart in inconsistent state.
2. **Atomic Batch Sync Endpoint `POST /api/cart/sync` (Chosen)**:
   - *Pros*: Single atomic transaction. Reads guest cart items associated with the `phanilie_guest_session` cookie, overwrites matching `SheetMusicId` entries in the user's `UserCartItems` table, copies non-overlapping guest items, clears the guest cart session, and returns the unified `UserCartDto`.
   - *Cons*: Requires transaction locking to prevent race conditions during concurrent logins.

### Final Decision & Rationale
**Selected Approach**: Atomic backend transaction executed via `POST /api/cart/sync`.  
**Overwrite Rule**:
```csharp
foreach (var guestItem in guestCartItems)
{
    var existingUserItem = userCartItems.FirstOrDefault(i => i.SheetMusicId == guestItem.SheetMusicId);
    if (existingUserItem != null)
    {
        existingUserItem.Quantity = guestItem.Quantity; // Overwrite strategy
        existingUserItem.UpdatedAt = DateTime.UtcNow;
    }
    else
    {
        userCartItems.Add(new UserCartItem {
            UserId = userId,
            SheetMusicId = guestItem.SheetMusicId,
            Quantity = guestItem.Quantity,
            CreatedAt = DateTime.UtcNow
        });
    }
}
```
**Rationale**: Guarantees zero item loss for non-overlapping items while strictly implementing the chosen overwrite behavior for duplicate selections.

---

## 3. UI Interaction & Confirmation Modal Flow

### Question / Problem Statement
What is the optimal UX flow when a user clicks "Add to Cart" on a sheet music item?

### Research Findings & Alternatives Evaluated
1. **Immediate Slide-Out Drawer**:
   - *Pros*: Direct visibility into cart contents.
   - *Cons*: Disconnects user from browsing list if they wanted to add multiple sheets consecutively.
2. **Confirmation Dialog Modal (Chosen)**:
   - *Pros*: Renders an attractive modal with item details, price in active currency, thumbnail preview, and two clear call-to-action buttons:
     - `"View Cart"` (Opens the slide-out cart drawer)
     - `"Continue Shopping"` (Closes modal and lets user remain on current page)
   - *Cons*: Requires modal component state in React context.

### Final Decision & Rationale
**Selected Approach**: Confirmation Dialog Modal triggered from `CartContext.addToCart()`.  
**Rationale**: Aligns with the clarified requirement and gives users explicit control over whether to view their cart or continue shopping.

---

## 4. Live Catalog Price Adjustments & Currency Formatting

### Question / Problem Statement
How should the cart handle dynamic price changes and dual-currency (`IDR`/`USD`) formatting?

### Research Findings & Alternatives Evaluated
1. **Store Price Snapshot in Cart**:
   - *Pros*: Simple static prices.
   - *Cons*: Cart items become stale if catalog prices update, causing checkout price mismatches.
2. **Dynamic Catalog Price Hydration + Inline Price Alert (Chosen)**:
   - *Pros*: Cart query joins live `SheetMusic` catalog tables. If `CartItem.SavedPriceIDR != LiveSheetMusic.PriceIDR` or `CartItem.SavedPriceUSD != LiveSheetMusic.PriceUSD`, the cart automatically updates line item prices and sets `IsPriceAdjusted = true` with `OldPrice` metadata. The frontend renders a subtle amber alert banner: *"Item price updated to current catalog pricing"*.
   - *Cons*: Slightly higher DB query join complexity (negligible impact with indexed foreign keys).

### Final Decision & Rationale
**Selected Approach**: Hydrate live catalog prices during cart fetch and flag price adjustments inline.  
**Rationale**: Ensures 100% price accuracy during checkout transition while maintaining transparent user communication.
