# API Contract: Pricing Localization & Payments

## 1. Initiate Checkout

`POST /api/payments/checkout`

Requires Authorization header (`Bearer <token>`). Creates an order and initializes payment gateway.

### Request Body

```json
{
  "itemType": "Membership",
  "itemId": 1,
  "countryCode": "ID"
}
```

### Success Response (200 OK) - Indonesian Buyer (Midtrans)

```json
{
  "orderNumber": "ORD-20260806-10492",
  "amount": 149000.0,
  "currency": "IDR",
  "gatewayName": "Midtrans",
  "checkoutUrlOrToken": "snap-token-abc123demo"
}
```

### Success Response (200 OK) - International Buyer (Stripe)

```json
{
  "orderNumber": "ORD-20260806-10493",
  "amount": 9.99,
  "currency": "USD",
  "gatewayName": "Stripe",
  "checkoutUrlOrToken": "https://checkout.stripe.com/c/pay/cs_test_abc123"
}
```

---

## 2. Midtrans Payment Webhook Notification

`POST /api/payments/midtrans-webhook`

Public callback receiver for Midtrans payment notifications.

---

## 3. Stripe Payment Webhook Notification

`POST /api/payments/stripe-webhook`

Public callback receiver for Stripe event notifications.
