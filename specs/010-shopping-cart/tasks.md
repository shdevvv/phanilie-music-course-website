# Tasks: Shopping Cart & Guest Sync

**Input**: Design documents from `/specs/010-shopping-cart/`  
**Prerequisites**: [plan.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/010-shopping-cart/plan.md), [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/010-shopping-cart/spec.md), [research.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/010-shopping-cart/research.md), [data-model.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/010-shopping-cart/data-model.md), [contracts/cart-api.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/010-shopping-cart/contracts/cart-api.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic directory structure verification.

- [ ] T001 Create feature branch `010-shopping-cart` and verify specs structure in `specs/010-shopping-cart/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database entities, DTOs, and service abstractions required before implementing user stories.

**⚠️ CRITICAL**: All user stories depend on these foundational database models and service interfaces.

- [ ] T002 [P] Create `GuestCartSession` and `GuestCartItem` EF Core entities in `backend/Models/GuestCartSession.cs` and `backend/Models/GuestCartItem.cs`
- [ ] T003 [P] Create `UserCartItem` EF Core entity in `backend/Models/UserCartItem.cs`
- [ ] T004 [P] Create `CartDto`, `CartItemDto`, `AddToCartDto`, and `UpdateCartItemDto` in `backend/Models/CartDto.cs`
- [ ] T005 Update `ApplicationDbContext.cs` in `backend/Data/ApplicationDbContext.cs` to add DbSets (`GuestCartSessions`, `GuestCartItems`, `UserCartItems`) and configure indexes
- [ ] T006 Apply EF Core database migration for cart entities in `backend/Data/`
- [ ] T007 Create `ICartService` interface contract in `backend/Services/ICartService.cs`

**Checkpoint**: Core data layer ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Guest Shopping Cart Management (Priority: P1) 🎯 MVP

**Goal**: Allow unauthenticated visitors to add, view, update quantities, and remove sheet music items in a guest cart drawer using HTTP-only guest session cookies, triggering the "View Cart" vs "Continue Shopping" dialog modal.

**Independent Test**: Adding items as a guest creates/updates the guest session cookie, triggers the confirmation modal, and renders updated cart drawer subtotals without login.

- [ ] T008 [US1] Implement guest cart cookie handling & CRUD operations in `backend/Services/CartService.cs`
- [ ] T009 [US1] Implement guest endpoints (`GET /api/cart`, `POST /api/cart/items`, `PUT /api/cart/items/{id}`, `DELETE /api/cart/items/{id}`) in `backend/Controllers/CartController.cs`
- [ ] T010 [P] [US1] Implement frontend API client service for cart in `frontend/src/services/cartService.ts`
- [ ] T011 [P] [US1] Implement `CartContext` state provider in `frontend/src/context/CartContext.tsx`
- [ ] T012 [P] [US1] Create confirmation dialog modal component `AddToCartModal.tsx` in `frontend/src/components/AddToCartModal.tsx`
- [ ] T013 [US1] Implement slide-out cart drawer component `CartDrawer.tsx` in `frontend/src/components/CartDrawer.tsx`
- [ ] T014 [US1] Integrate `CartContext` and navbar badge counter into `layout.tsx` in `frontend/src/layout.tsx`

**Checkpoint**: User Story 1 fully functional as MVP. Guests can add items, view confirmation modal, and manage cart drawer.

---

## Phase 4: User Story 2 - Automatic Guest Cart Sync upon Login/Register (Priority: P2)

**Goal**: Automatically merge guest cart items into an authenticated user's database cart upon sign-in using an **Overwrite** strategy for duplicate items, with non-blocking retry on failure.

**Independent Test**: Add items as a guest, log into an existing student account with pre-existing cart items, and verify duplicate account items are overwritten with guest quantities and guest session cookie is cleared.

- [ ] T015 [US2] Implement atomic post-login cart merge (`POST /api/cart/sync`) with overwrite logic in `backend/Services/CartService.cs`
- [ ] T016 [US2] Expose `POST /api/cart/sync` endpoint in `backend/Controllers/CartController.cs`
- [ ] T017 [US2] Integrate automatic cart sync call upon authentication in `frontend/src/context/CartContext.tsx`
- [ ] T018 [US2] Add non-blocking toast warning and retry handler for sync failures in `frontend/src/context/CartContext.tsx`

**Checkpoint**: User Story 2 complete. Authentication seamlessly syncs guest selections into student accounts.

---

## Phase 5: User Story 3 - Dual Currency Formatting & Checkout Transition (Priority: P3)

**Goal**: Dynamically format line item prices and subtotals in `IDR` or `USD`, update items to current catalog prices with inline alerts, and transition to checkout.

**Independent Test**: Toggling currency preference in cart drawer re-formats all prices; catalog price adjustments display an amber inline alert.

- [ ] T019 [US3] Implement live catalog price hydration and price adjustment flagging (`isPriceAdjusted`) in `backend/Services/CartService.cs`
- [ ] T020 [US3] Implement currency toggle handler and price adjustment banner in `frontend/src/components/CartDrawer.tsx`
- [ ] T021 [US3] Connect checkout button in `CartDrawer.tsx` to navigate to `/checkout` with locked cart items in `frontend/src/components/CartDrawer.tsx`

**Checkpoint**: User Story 3 complete. Dual currency formatting and checkout navigation verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: System verification, unit testing, and end-to-end quickstart validation.

- [ ] T022 [P] Add backend unit tests for `CartService` (overwrite merge, price adjustment, session cookie) in `backend/Tests/CartServiceTests.cs`
- [ ] T023 Run end-to-end quickstart validation scenarios per `specs/010-shopping-cart/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phases 3-5)**: Depend on Foundational phase completion. Proceed sequentially in priority order (US1 MVP → US2 → US3).
- **Polish (Phase 6)**: Depends on User Stories 1-3 completion.

### Parallel Opportunities

- Foundational tasks `T002`, `T003`, `T004` can run in parallel (separate entity files).
- Frontend tasks `T010` (cartService), `T011` (CartContext), and `T012` (AddToCartModal) can run in parallel.
- `T022` unit tests can run in parallel with polish validation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup (Phase 1) & Foundational (Phase 2).
2. Complete User Story 1 (Phase 3: T008 - T014).
3. **STOP and VALIDATE**: Verify unauthenticated guest cart drawer and modal interaction.

### Incremental Delivery
1. Deliver US1 MVP → Guests can manage cart and view modal.
2. Deliver US2 → Seamless post-login sync with overwrite merge rule.
3. Deliver US3 → Dual-currency display and checkout transition.
