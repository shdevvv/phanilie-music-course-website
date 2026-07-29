# Technical Implementation Plan: SPEC-003 Pricing Localization & Dual Payments

**Module Directory**: `docs/specs/003-pricing-localization-payments`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices

* **Backend**: ASP.NET Core 10 Web API (`CheckoutController.cs`, `WebhooksController.cs`).
* **Payment SDKs**: `Midtrans.Net` / SNAP API & `Stripe.net`.
* **Design Pattern**: Strategy Pattern (`IPaymentGateway`, `MidtransPaymentService`, `StripePaymentService`).

---

## 2. Codebase Architecture & Folder Structure

```text
backend/
├── Services/
│   ├── Interfaces/IPaymentGateway.cs      # Common payment gateway contract
│   ├── Implementations/
│   │   ├── MidtransPaymentService.cs      # IDR payment processor
│   │   └── StripePaymentService.cs        # USD payment processor
├── Controllers/
│   ├── CheckoutController.cs              # Order creation & session initiation
│   └── WebhooksController.cs              # Webhook verification & order fulfillment
```

---

## 3. Payment Processing Pipeline & Webhook Verification

### 3.1 Strategy Interface Definition
```csharp
public interface IPaymentGateway
{
    Task<PaymentInitiationResult> InitiateCheckoutAsync(Order order, string returnUrl);
    Task<bool> VerifyWebhookSignatureAsync(HttpRequest request);
    Task FulfillOrderAsync(string transactionId);
}
```

### 3.2 Webhook Handling Logic
1. Webhook hits `POST /api/webhooks/midtrans` or `POST /api/webhooks/stripe`.
2. Service calculates signature hash (HMAC SHA512 for Midtrans / Stripe Webhook Secret).
3. If valid and status == `settlement`/`paid`, updates `Order.Status = "Paid"`.
4. Creates records in `UserLibrary` for sheet music items or updates `User.SubscriptionEndDate` for plans.

---

## 4. Implementation Roadmap

1. **Step 1**: Implement `IPaymentGateway` interface and DTOs.
2. **Step 2**: Integrate `MidtransPaymentService` (SNAP Token API).
3. **Step 3**: Integrate `StripePaymentService` (Checkout Sessions API).
4. **Step 4**: Implement `WebhooksController` with HMAC signature validation.
5. **Step 5**: Build frontend Checkout page with currency selector and redirect handlers.
