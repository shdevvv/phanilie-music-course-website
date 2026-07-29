# Feature Specification: 003 Pricing Localization & Dual Payments

**Feature Branch**: `003-pricing-localization-payments`  
**Created**: 2026-07-29  
**Status**: Approved Specification  
**Input**: Regional currency pricing display (IDR & USD), adaptive local/global checkout routing, instant payment fulfillment, and webhook verification.  

---

## User Scenarios & Testing

### User Story 1 - Regional Currency & Price Display (Priority: P1)

As an Indonesian or International Music Learner, when I view subscription plans or browse sheet music arrangements, I want to see prices automatically displayed in my native currency (IDR for Indonesia, USD for International) so that I can evaluate costs transparently without manual currency conversion.

**Why this priority**: Displaying familiar regional currency eliminates checkout hesitation and prevents currency conversion confusion.

**Independent Test**: Visiting the site from an Indonesian region renders prices in Rupiah (e.g., `Rp 149.000`), while visiting from an international region renders prices in US Dollars (e.g., `$9.99`).

**Acceptance Scenarios**:
1. **Given** an Indonesian user browsing sheet music, **When** they view catalog item prices, **Then** all prices are formatted in IDR with proper regional currency symbols (e.g., `Rp 45.000`).
2. **Given** an international user inspecting membership tiers, **When** they view plan prices, **Then** all prices are formatted in USD with dollar symbols (e.g., `$9.99`).

---

### User Story 2 - Local Indonesian Payment Checkout & Auto-Fulfillment (Priority: P2)

As an Indonesian Buyer, when I checkout a sheet music arrangement or subscription plan, I want to pay using local Indonesian payment methods (QRIS, Bank Virtual Accounts, E-Wallets) and have my items unlocked immediately upon payment completion.

**Why this priority**: Provides instant, frictionless checkout for the core local Indonesian student base where credit card usage is low.

**Independent Test**: Selecting QRIS or BCA Virtual Account during checkout generates a scannable payment code that automatically unlocks the purchased items in the user's digital library upon payment confirmation.

**Acceptance Scenarios**:
1. **Given** an Indonesian user initiating checkout in IDR, **When** they select QRIS or Virtual Bank Account, **Then** a scannable QR code or bank payment number is presented to the buyer.
2. **Given** a buyer completing a QRIS or Virtual Account payment, **When** payment notification is verified, **Then** the purchased items are automatically unlocked in the buyer's digital library and a confirmation receipt is issued.

---

### User Story 3 - Global International Payment Checkout & Auto-Fulfillment (Priority: P3)

As an International Buyer, when I purchase a sheet music score or membership tier, I want to pay securely using global credit/debit cards or PayPal and receive instant access to my digital items.

**Why this priority**: Serves the global international user base with standard credit card and PayPal payment processing.

**Independent Test**: Initiating checkout in USD presents a secure credit card and PayPal entry modal that processes the payment and redirects to the user's unlocked digital library.

**Acceptance Scenarios**:
1. **Given** an international user initiating checkout in USD, **When** they proceed to payment, **Then** a secure card and PayPal processing interface is presented.
2. **Given** an international buyer completing card or PayPal payment, **When** payment verification succeeds, **Then** the order status updates to paid and the purchased items are immediately accessible in the user's library.

---

### Edge Cases
- **Payment Abandonment / Expiration**: What happens when a user opens a QRIS payment prompt or payment gateway but fails to complete payment within the time limit? The order MUST expire safely after 24 hours without unlocking items.
- **Webhook Delivery Retries**: How does the system handle duplicate payment webhooks sent by payment channels? Payment processing MUST be idempotent, ensuring items are unlocked exactly once even if multiple webhook notifications arrive.

---

## Requirements

### Functional Requirements

- **FR-003-1**: The system MUST store and maintain explicit dual-currency pricing (`Price_IDR` and `Price_USD`) for all membership plans and sheet music catalog items.
- **FR-003-2**: The UI MUST automatically detect user region during onboarding/auth and display pricing in IDR for Indonesian users and USD for International users.
- **FR-003-3**: Initiating checkout in IDR MUST support local Indonesian payment rails: QRIS, Bank Virtual Accounts (BCA, Mandiri, BNI, BRI), and E-Wallets (GoPay, ShopeePay).
- **FR-003-4**: Initiating checkout in USD MUST support global payment rails: Credit Cards, Debit Cards, and PayPal.
- **FR-003-5**: Payment verification notifications MUST securely validate cryptographic signatures before marking orders as paid and unlocking items in `UserLibrary`.
- **FR-003-6**: Payment processing MUST be idempotent, preventing duplicate item fulfillment or double subscription activations.

### Key Entities

- **Order**: Represents an e-commerce checkout transaction containing buyer details, total amount, assigned currency (`IDR`/`USD`), and payment status (`Pending`, `Paid`, `Expired`, `Cancelled`).
- **OrderItem**: Represents individual sheet music or subscription plan items attached to an order.
- **PaymentTransaction**: Represents payment gateway transaction logs, storing payment channel type, external transaction reference, and signature verification status.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 95% of buyers see prices formatted in their native currency on initial page load without manual adjustments.
- **SC-002**: Users can complete local or global payment checkout in under 60 seconds.
- **SC-003**: 100% of verified successful payments automatically unlock purchased items in the buyer's library within 3 seconds of payment confirmation.
- **SC-004**: Zero duplicate items or double subscription activations occur during payment retries or duplicate webhook delivery.

---

## Assumptions

- Regional currency detection defaults to USD for any non-Indonesian IP region.
- Unlocked digital sheet music items remain permanently accessible in the buyer's digital library.
