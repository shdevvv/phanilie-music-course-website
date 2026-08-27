# Quickstart & Validation Guide: Pricing Localization & Payments

## End-to-End Validation Scenarios

### Scenario 1: IDR Currency Localization & Midtrans Checkout
1. Open web application (`http://localhost:5173`).
2. Log in and select country "Indonesia".
3. Select "Monthly Plan" (Rp 149.000) and click "Proceed to Payment".
4. Verify system creates an order in IDR currency and returns Midtrans Snap token.

### Scenario 2: USD Currency Localization & Stripe Checkout
1. Select country "United States" or International.
2. Select "Monthly Plan" ($9.99) and click "Proceed to Payment".
3. Verify system creates an order in USD currency and returns Stripe Checkout URL.

### Scenario 3: Order Fulfillment & Webhook Verification
1. Simulate posting a valid payment notification to `/api/payments/midtrans-webhook`.
2. Verify order status transitions from `Pending` to `Paid`.
3. Verify user's `IsSubscribed` flag updates to `true`.

## Build Verification Commands

```bash
# Frontend TypeScript & Vite build
cd frontend
npm run build

# Backend .NET API build
cd backend
dotnet build
```
