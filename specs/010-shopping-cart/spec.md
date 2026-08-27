# Feature Specification: Shopping Cart & Guest Sync

**Feature Branch**: `010-shopping-cart`  
**Created**: 2026-08-11  
**Status**: Approved Specification  
**Input**: User description: "docs/specs/010/spec.md"

---

## Clarifications

### Session 2026-08-11

- Q: Guest Cart Sync Merge Strategy → A: Overwrite account cart items with guest cart items upon login/registration.
- Q: Client-Side Guest Cart Persistence → A: HTTP-only Guest Session Cookie (Backend-managed session).
- Q: Add to Cart Interaction Behavior → A: Show dialog modal asking "View Cart" or "Continue Shopping".
- Q: Cart Sync Failure Handling → A: Preserve guest cart and retry sync on next page load/action with a non-blocking toast warning.
- Q: Price Change Handling in Cart → A: Automatically update cart item to current catalog price and render an inline price change alert.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest Shopping Cart Management (Priority: P1)

As an unauthenticated visitor, I want to add, view, update quantities, and remove sheet music items in a guest cart drawer so that I can prepare a purchase before creating an account or logging in.

**Why this priority**: Essential prerequisite for e-commerce conversion; allows friction-free exploration and selection of sheet music before committing to registration.

**Independent Test**: Adding items as a guest updates the cart drawer state, navbar badge counter, and cart subtotal in cookie persistence without requiring login.

**Acceptance Scenarios**:

1. **Given** a guest visitor browsing sheet music catalog items, **When** they click "Add to Cart", **Then** the system renders a dialog modal asking "View Cart" or "Continue Shopping", while the navbar badge counter increments.
2. **Given** a guest with items in their cart, **When** they open the cart drawer and update quantity or click "Remove", **Then** the cart subtotal recalculates instantly and state persists via HTTP-only guest session cookies.
3. **Given** an empty cart drawer, **When** opened, **Then** an empty cart message with a "Browse Sheet Music" call-to-action button is rendered.

---

### User Story 2 - Automatic Guest Cart Sync upon Login/Register (Priority: P2)

As a registered student logging into my account, I want my guest cart items automatically synchronized with my database account cart so that I don't lose my selected sheet music items when signing in.

**Why this priority**: Seamless user experience during onboarding and login transition; prevents cart item loss and cart abandonment during authentication.

**Independent Test**: Adding items to guest cart, logging into an existing student account, and verifying that local items merge into the user's database cart state.

**Acceptance Scenarios**:

1. **Given** a guest with items in a guest session cookie, **When** they complete login or registration, **Then** the system automatically sends a sync request to merge guest cart items into the account's database cart.
2. **Given** overlapping items between guest cart and database cart, **When** merged, **Then** duplicate items in the account cart are overwritten with the guest cart line item quantity.
3. **Given** cart sync completion, **When** client cart state is inspected, **Then** the guest cart cookie session is cleared and synchronized with the unified backend database cart.

---

### User Story 3 - Dual Currency Formatting & Checkout Transition (Priority: P3)

As a student or guest buyer, I want my cart subtotal, item prices, and discounts dynamically formatted according to my currency preference (IDR or USD) and a direct button to proceed to checkout.

**Why this priority**: Supports dual-currency pricing for domestic (IDR) and international (USD) audiences with smooth checkout handoff.

**Independent Test**: Toggling currency preference between IDR and USD re-formats all cart prices (e.g. `Rp 150.000` vs `$9.99`) and passes selected items to `/checkout`.

**Acceptance Scenarios**:

1. **Given** a cart with items, **When** the user toggles currency between IDR and USD, **Then** all line item prices and total amounts immediately recalculate and display with appropriate currency formatting.
2. **Given** a cart with at least one item, **When** the user clicks "Proceed to Checkout", **Then** the drawer closes and navigates the user to the checkout route (`/checkout`) with cart items locked for order creation.
3. **Given** an item in cart whose catalog price has changed, **When** opening cart, **Then** the item price automatically updates to current catalog price and renders an inline price change alert before checkout.

---

### Edge Cases

- **Concurrent Session Sync**: If a user is logged in across multiple browsers or devices, updating the cart in Browser A emits a sync update reflected in Browser B upon drawer opening.
- **Stale Cart Pruning**: Deleted or invalid sheet music item references stored in guest cart session are gracefully pruned during drawer load with a non-intrusive notification.
- **Sync Failure Recovery**: If background cart sync fails upon authentication due to network or server issues, the guest cart is preserved and re-attempted on subsequent page loads with a non-blocking toast warning.
- **Quantity Limits**: Digital sheet music items default to 1 license per purchase unless bulk or multi-user licenses are enabled.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-010-1**: System MUST allow unauthenticated guest visitors to add, update quantity, and remove sheet music items in guest cart session state managed via HTTP-only cookies.
- **FR-010-2**: System MUST render a slide-out cart drawer accessible from any page, featuring item titles, thumbnails, unit prices, quantity controls, subtotal, and an interactive navbar badge counter. Clicking "Add to Cart" MUST display a modal prompt offering "View Cart" or "Continue Shopping".
- **FR-010-3**: System MUST automatically synchronize guest cart items into the authenticated user's database cart upon successful login or user registration.
- **FR-010-4**: System MUST dynamically format line item prices, subtotals, and currency symbols based on active user currency preference (`IDR` or `USD`).
- **FR-010-5**: System MUST resolve duplicate line items during guest cart sync by overwriting pre-existing account cart line item quantities with the guest cart line item quantities.
- **FR-010-6**: System MUST validate item availability and pricing integrity when transitioning from cart drawer to checkout (`/checkout`).
- **FR-010-7**: System MUST provide an empty cart state with a direct navigation link to the sheet music catalog (`/store`).
- **FR-010-8**: System MUST preserve guest cart state and retry cart synchronization on subsequent page loads with a non-blocking toast warning if post-login cart sync fails.
- **FR-010-9**: System MUST automatically update cart item prices to current catalog prices and render an inline price adjustment notification if a catalog item's price changes prior to checkout.

### Key Entities

- **CartItem**: Represents an individual sheet music item in the cart (CartItem ID, SheetMusic ID, Title, Cover Image URL, Price IDR, Price USD, Quantity, Selected At).
- **GuestCart**: Backend-managed session entity storing unauthenticated cart items and active currency preference via HTTP-only guest cookie.
- **UserCart**: Backend database entity mapping authenticated User ID to a collection of CartItems.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cart drawer opens within 150ms of trigger interaction on desktop and mobile.
- **SC-002**: Local guest cart items merge successfully into backend account cart within 500ms of authentication completion.
- **SC-003**: 100% of line item prices and subtotals accurately reflect the active currency (`IDR` or `USD`) without calculation mismatch.
- **SC-004**: 0% item loss during guest session transition to authenticated student session.

---

## Assumptions

- Digital sheet music items default to a quantity of 1 per license.
- User currency preference defaults to `IDR` for domestic IP addresses/locales and `USD` for international visitors.
- Guest cart sync executes silently in the background as part of the post-login sequence.
