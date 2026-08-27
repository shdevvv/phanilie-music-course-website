# Research & Technical Decisions: Pricing Localization & Payments

## 1. Geo-IP & Currency Detection Strategy

- **Decision**: Combined Header & Profile Strategy in `backend/Services/LocalizationService.cs`.
- **Logic**:
  1. Inspect `X-Country-Code` or `CF-IPCountry` request headers.
  2. If user is authenticated, fall back to `User.CountryCode`.
  3. If country == `ID` -> Currency = `IDR` (Payment Gateway = `Midtrans`).
  4. Otherwise -> Currency = `USD` (Payment Gateway = `Stripe`).

## 2. Payment Gateway Architecture Strategy

- **Decision**: Implement Strategy Pattern behind interface `IPaymentGateway` in Backend API (`backend/Services/IPaymentGateway.cs`).
- **Implementations**:
  - `MidtransPaymentGateway`: Generates Midtrans Snap transaction tokens and validates SHA512 webhooks.
  - `StripePaymentGateway`: Creates Stripe Checkout sessions and validates HMAC-SHA256 webhook signatures.
- **Rationale**: Aligns directly with Constitution Principle II (Loose Coupling & Interface-Driven Design).

## 3. Webhook Handling & Order Fulfillment

- **Decision**: Webhook Controller `PaymentWebhookController.cs` executing atomic order state transition (`Pending` -> `Paid`) and automatic subscription activation or sheet music library unlocking.
