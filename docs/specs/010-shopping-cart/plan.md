# Technical Implementation Plan: SPEC-010 Shopping Cart & Guest Sync

**Module Directory**: `docs/specs/010-shopping-cart`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices
* **Backend**: ASP.NET Core 10 Web API (`CartController.cs`).
* **Frontend**: React Context API (`CartContext.jsx`) & `localStorage`.

## 2. Codebase Architecture & Folder Structure
```text
backend/
├── Controllers/CartController.cs
├── Models/CartItem.cs
frontend/
├── src/context/CartContext.jsx
├── src/components/common/CartDrawer.jsx
```

## 3. Cart Synchronization Flow
1. Guest adds item -> stored in React state & `localStorage`.
2. User authenticates -> `AuthContext` calls `POST /api/cart/sync` sending guest cart array.
3. Backend merges unique items into user's DB `CartItem` table.

## 4. Implementation Roadmap
1. Create `CartItem` entity.
2. Build `CartController` (GET, POST, DELETE, Sync).
3. Build React `CartContext` & `CartDrawer`.
