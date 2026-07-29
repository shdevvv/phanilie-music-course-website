# Feature Specification: SPEC-010 Shopping Cart & Guest Sync

**Module Directory**: `docs/specs/010-shopping-cart`  
**Status**: Approved Specification  
**Target Workflow**: `/speckit.specify`  

---

## 1. Feature Overview & Core Purpose
The **Shopping Cart & Guest Sync** module allows visitors and students to manage selected sheet music items in a cart, with automatic merging of guest cart items into user account carts upon login.

## 2. Functional Requirements
* **FR-010-1**: Unauthenticated visitors MUST be able to manage items in a local shopping cart.
* **FR-010-2**: Logging in or registering MUST automatically synchronize guest cart items into the user's database cart.
* **FR-010-3**: Cart totals MUST dynamically format based on the user's currency preference (IDR or USD).

## 3. User Experience Guidelines
Slide-out cart drawer, animated badge counter in navbar, and seamless transition to checkout.
