# Feature Specification: Pricing Localization & Payments

**Feature Branch**: `003-pricing-localization-payments`  
**Created**: 2026-08-06  
**Status**: Approved Specification  
**Input**: Geo-IP country & currency localization (IDR vs USD), Midtrans gateway integration for Indonesian buyers (QRIS, Bank Transfer, E-Wallets), Stripe gateway integration for global buyers (Credit/Debit Cards, PayPal), payment webhook handling, and order fulfillment.

---

## User Scenarios & Testing

### User Story 1 - Geo-IP Country & Currency Localization (Priority: P1)

As a Buyer or Subscriber, I want the platform to automatically detect my country or allow me to select my location so that prices across membership plans and digital sheet music display in my local currency (IDR for Indonesia, USD for International).

**Why this priority**: Correct currency presentation and localized pricing builds buyer trust and eliminates checkout friction.

**Independent Test**: Accessing the platform from Indonesia displays prices in IDR (Rp) and routes checkout through Midtrans; selecting International displays USD ($) and routes checkout through Stripe.

**Acceptance Scenarios**:
1. **Given** an Indonesian visitor or user with country `ID`, **When** viewing pricing tables or catalog items, **Then** all prices render in IDR (e.g. `Rp 149.000`).
2. **Given** an International visitor or user with country outside Indonesia, **When** viewing pricing tables or catalog items, **Then** all prices render in USD (e.g. `$9.99`).

---

### User Story 2 - Indonesian Payment Processing via Midtrans (Priority: P2)

As an Indonesian Buyer, when I checkout a membership plan or sheet music score, I want to pay using popular Indonesian payment methods (QRIS, Bank Transfer, GoPay/OVO) so that I can complete transactions seamlessly.

**Why this priority**: Midtrans provides 100% localization for the primary Indonesian student user base.

**Independent Test**: Initiating IDR checkout generates a Midtrans Snap transaction token, opens the payment iframe/redirect, and completing payment triggers webhook fulfillment.

**Acceptance Scenarios**:
1. **Given** an IDR order at checkout, **When** the buyer clicks "Proceed to Payment", **Then** the system requests a Midtrans Snap transaction token and renders the Midtrans payment dialog.
2. **Given** a successful Midtrans payment notification (`transaction_status = settlement`), **When** Midtrans sends a signed HTTP POST webhook, **Then** the system marks the order as `Paid` and activates the user's subscription or sheet music library access.

---

### User Story 3 - Global International Payment Processing via Stripe (Priority: P3)

As a Global International Buyer, when I checkout in USD, I want to pay securely using Credit/Debit Cards or PayPal via Stripe so that I can purchase content from anywhere in the world.

**Why this priority**: Expands platform reach to international piano students globally.

**Independent Test**: Initiating USD checkout redirects to a secure Stripe Checkout session URL and receiving `checkout.session.completed` webhook fulfills the order.

**Acceptance Scenarios**:
1. **Given** a USD order at checkout, **When** the buyer clicks "Proceed to Stripe Payment", **Then** the system creates a Stripe Checkout Session and redirects the buyer to the hosted Stripe payment page.
2. **Given** a successful Stripe payment webhook (`checkout.session.completed`), **When** Stripe posts the signed event payload, **Then** the system verifies the signature and fulfills the purchased items.

---

### Edge Cases

- **Invalid Webhook Signature**: Incoming webhook notifications with invalid HMAC signatures MUST be rejected immediately with HTTP 400 Bad Request to prevent spoofing attacks.
- **Payment Expiration / Cancelation**: Orders left pending past 24 hours automatically transition to `Expired` status and cancel pending access tokens.

---

## Requirements

### Functional Requirements

- **FR-003-1**: The system MUST detect the user's country via Geo-IP header or user profile claim and assign currency (`IDR` for Indonesia, `USD` for International).
- **FR-003-2**: Pricing across membership plans and sheet music MUST render in the localized currency format (`Rp XX.XXX` or `$XX.XX`).
- **FR-003-3**: IDR checkouts MUST generate a Midtrans Snap transaction token supporting QRIS, Bank Transfers, and E-Wallets.
- **FR-003-4**: USD checkouts MUST create a Stripe Checkout session supporting Visa, Mastercard, Amex, and PayPal.
- **FR-003-5**: Payment webhooks from Midtrans (`/api/payments/midtrans-webhook`) and Stripe (`/api/payments/stripe-webhook`) MUST validate HMAC signature headers before fulfilling orders.
- **FR-003-6**: Successful payment fulfillment MUST update the order status to `Paid` and automatically activate subscription status or unlock sheet music in the user's library.

### Key Entities

- **Order**: Represents a customer transaction (Id, UserId, OrderNumber, Amount, Currency, PaymentGateway, PaymentStatus, CreatedAt).
- **PaymentTransaction**: Logs gateway-specific transaction details (Id, OrderId, GatewayTransactionId, GatewayName, PayloadJson, Status).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of payment webhooks with valid signatures complete order fulfillment within 2 seconds.
- **SC-002**: 0% of unsigned or tampered payment webhooks are processed by the system.
- **SC-003**: Currency detection and payment gateway selection completes in under 10 milliseconds.

---

## Assumptions

- Midtrans sandbox keys are used for IDR test transactions; Stripe test keys are used for USD test transactions.
- Webhook endpoints are publicly accessible or simulated during development.
