# Data Model: Pricing Localization & Payments

## Entities & DTOs

### 1. Order (Entity)
- **id** (`integer`): Primary key.
- **userId** (`integer`): Foreign key referencing `User`.
- **orderNumber** (`string`): Unique reference number (e.g. `ORD-20260806-9182`).
- **amount** (`decimal`): Transaction total amount.
- **currency** (`string`): `IDR` or `USD`.
- **paymentGateway** (`string`): `Midtrans` or `Stripe`.
- **paymentStatus** (`string`): `Pending`, `Paid`, `Expired`, `Failed`.
- **itemsJson** (`string`): Serialized JSON array of ordered items.
- **createdAt** (`datetime`): Timestamp of creation.

### 2. PaymentTransaction (Entity)
- **id** (`integer`): Primary key.
- **orderId** (`integer`): Foreign key referencing `Order`.
- **gatewayTransactionId** (`string`): Gateway reference ID (Midtrans OrderID / Stripe SessionID).
- **gatewayName** (`string`): `Midtrans` or `Stripe`.
- **payloadJson** (`string`): Raw payload log for audit verification.
- **status** (`string`): Webhook status.

### 3. Checkout DTOs
- **CheckoutRequestDto**:
  - `itemType`: `"Membership"` | `"SheetMusic"`.
  - `itemId`: Target entity ID.
  - `countryCode`: Optional override country code (e.g. `"ID"` or `"US"`).
- **CheckoutResponseDto**:
  - `orderNumber`: Generated order reference.
  - `amount`: Final localized price.
  - `currency`: Assigned currency (`IDR`/`USD`).
  - `gatewayName`: Target payment gateway (`Midtrans`/`Stripe`).
  - `checkoutUrlOrToken`: Midtrans Snap token or Stripe Checkout Session URL.
