# Feature Specification: SPEC-003 Pricing Localization & Dual Payments

**Module Directory**: `docs/specs/003-pricing-localization-payments`  
**Status**: Approved Specification  
**Target Workflow**: `/speckit.specify`  

---

## 1. Feature Overview & Core Purpose

### 1.1 Overview
The **Pricing Localization & Dual Payments** module provides regional pricing display and dual payment gateway integrations (Midtrans for Indonesia and Stripe for International users), delivering localized checkout experiences for both Indonesian Rupiah (IDR) and US Dollar (USD) transactions.

### 1.2 Core Purpose
* Eliminate conversion fees and payment failures for Indonesian students by offering QRIS, Virtual Bank Accounts, and local E-Wallets via Midtrans.
* Provide international buyers with frictionless global credit card and PayPal processing via Stripe.

---

## 2. Target Audience & Problem Statement

### 2.1 Target Audience
* **Indonesian Buyers**: Expecting local Rupiah pricing and instant QRIS/Virtual Account payment methods.
* **International Buyers**: Expecting USD pricing and credit card/PayPal processing.

### 2.2 Core Problem Statement
Forcing international payment gateways on local Indonesian users results in high drop-off rates due to low credit card penetration. Conversely, using local gateways for international buyers causes payment failures.

---

## 3. Functional Requirements

### 3.1 Dual Currency Display Requirements
* **FR-003-1**: Database entities for Membership Plans and Sheet Music MUST store explicit prices for both currencies (`Price_IDR` and `Price_USD`).
* **FR-003-2**: The UI MUST dynamically format and display price values based on user region:
  * **Indonesia (IDR)**: `Rp 149.000`
  * **Global (USD)**: `$9.99`

### 3.2 Payment Gateway Routing & Fulfillment Requirements
* **FR-003-3**: Initiating checkout in IDR MUST generate a Midtrans SNAP transaction token supporting QRIS, Virtual Accounts (BCA, Mandiri, BNI, BRI), and E-Wallets (GoPay, ShopeePay).
* **FR-003-4**: Initiating checkout in USD MUST generate a Stripe Checkout Session URL supporting Credit Cards, Debit Cards, and PayPal.
* **FR-003-5**: Gateway webhooks MUST verify signatures securely before unlocking digital sheet music in `UserLibrary` or activating subscription claims.

---

## 4. User Experience & Interaction Guidelines

### 4.1 Checkout UX Flow
* Clear order summary displaying items, taxes, currency toggle, and payment method logos.
* Seamless redirect to payment gateway overlay or hosted page.
* Immediate redirection back to "My Library" or "Dashboard" upon payment confirmation.
