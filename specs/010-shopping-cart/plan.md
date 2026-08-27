# Implementation Plan: SPEC-010 Shopping Cart & Guest Sync

**Branch**: `010-shopping-cart` | **Date**: 2026-08-11 | **Spec**: [spec.md](file:///d:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/010-shopping-cart/spec.md)

**Input**: Feature specification from `specs/010-shopping-cart/spec.md`

---

## Summary

The **Shopping Cart & Guest Sync** module provides persistent cart management for unauthenticated guests via HTTP-only guest session cookies (`phanilie_guest_session`) and database-backed carts for logged-in students. Upon login or registration, guest items automatically merge into the user's account cart using an **Overwrite** strategy for duplicate items. The UI features a slide-out cart drawer, navbar badge counter, confirmation dialog modal on "Add to Cart", live catalog price validation with inline adjustment alerts, and dynamic dual-currency (`IDR`/`USD`) support.

---

## Technical Context

**Language/Version**: C# (.NET 9 ASP.NET Core Web API), TypeScript (React 18, Vite)  
**Primary Dependencies**: EF Core 9, Microsoft.AspNetCore.Authentication.JwtBearer, Lucide React Icons, React Router DOM  
**Storage**: SQLite / PostgreSQL (`UserCartItems`, `GuestCartSessions`, `GuestCartItems`)  
**Testing**: xUnit (Backend Integration & Unit Tests), Vitest / React Testing Library (Frontend)  
**Target Platform**: Modern Web Browsers (Desktop & Mobile viewports)  
**Project Type**: Web Application (ASP.NET Core Backend API + React Vite Single Page App)  
**Performance Goals**: Cart drawer render <150ms; post-login guest cart sync <500ms  
**Constraints**: Sub-200ms p95 API response, HTTP-only cookie security, zero item loss on session transition  
**Scale/Scope**: Support 10k+ concurrent active guest & student carts  

---

## Constitution Check

*GATE: All checks passed. Compliant with Phanilie Music Platform Constitution v1.0.1.*

- [x] **Single Responsibility & Modular Design**: `CartService` handles cart domain logic; `CartController` manages HTTP endpoints; `CartContext` encapsulates client state.
- [x] **Loose Coupling & Interfaces**: High-level controllers depend on `ICartService` interface abstractions.
- [x] **Code Quality & SOLID**: Models and DTOs enforce strict single-purpose contracts without monolithic bloat.
- [x] **Testing Standards**: xUnit test suite covers `CartService` overwrite merge logic, price adjustment hydration, and cookie token generation.
- [x] **UX & Frontend Integration**: Integrates into existing dark-mode gold theme (`#D4AF37`) without breaking existing navbar or layout.
- [x] **Performance & Optimization**: Indexed foreign key joins (`UserId`, `SessionId`, `SheetMusicId`) ensure sub-50ms query execution.

---

## Project Structure

### Documentation (this feature)

```text
specs/010-shopping-cart/
├── plan.md              # Implementation plan
├── research.md          # Phase 0 output (cookie architecture, merge strategy, UX flow)
├── data-model.md        # Phase 1 output (entities, ER diagrams, DTOs)
├── quickstart.md        # Phase 1 output (validation & end-to-end testing scenarios)
├── contracts/           # Phase 1 output
│   └── cart-api.md      # REST API contracts
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
backend/
├── Controllers/
│   └── CartController.cs             # GET/POST/PUT/DELETE /api/cart endpoints
├── Data/
│   └── ApplicationDbContext.cs       # DbSets for UserCartItems, GuestCartSessions, GuestCartItems
├── Models/
│   ├── UserCartItem.cs               # Authenticated cart item EF entity
│   ├── GuestCartSession.cs           # Guest session EF entity
│   ├── GuestCartItem.cs              # Guest line item EF entity
│   └── CartDto.cs                    # Cart DTOs (CartDto, CartItemDto, AddToCartDto, etc.)
└── Services/
    ├── ICartService.cs               # Cart service strategy interface
    └── CartService.cs                # Implementation of cart CRUD, live price hydration & sync

frontend/src/
├── components/
│   ├── CartDrawer.tsx                # Slide-out cart drawer component
│   └── AddToCartModal.tsx            # "View Cart" vs "Continue Shopping" dialog modal
├── context/
│   └── CartContext.tsx               # Cart state provider (badge count, drawer toggle, sync trigger)
└── services/
    └── cartService.ts                # API client for /api/cart endpoints
```

**Structure Decision**: Web application layout integrating into existing `backend/` (.NET Web API) and `frontend/` (React SPA).

---

## Complexity Tracking

> **No violations**. Design strictly adheres to Constitution v1.0.1 principles.
