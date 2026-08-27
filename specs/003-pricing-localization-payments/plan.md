# Implementation Plan: Pricing Localization & Payments

**Branch**: `003-pricing-localization-payments` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///D:/Projects%20IT/Project%20IT%20-%20Phanilie-New/specs/003-pricing-localization-payments/spec.md)

**Input**: Feature specification from `/specs/003-pricing-localization-payments/spec.md`

## Summary

Implement Geo-IP & country-based currency localization (IDR vs USD) with dual payment gateway integration using the Strategy pattern (`IPaymentGateway`). Integrates Midtrans Snap for Indonesian IDR buyers (QRIS, Bank Transfer, E-Wallets) and Stripe Checkout for global USD buyers (Cards, PayPal), complete with webhook signature validation and order status fulfillment.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 (Frontend), C# .NET 9 Web API (Backend)  
**Primary Dependencies**: React 19, Vite, TailwindCSS 4.x, EF Core, Midtrans Client, Stripe SDK / HTTP Client  
**Storage**: Database (PostgreSQL/SQL Server) for Order & PaymentTransaction entities  
**Testing**: Oxlint & TypeScript compiler check (`npm run build`), `dotnet build` / `dotnet test` for API  
**Target Platform**: Web (Desktop & Mobile Viewports)  
**Project Type**: Fullstack Web Application  
**Performance Goals**: <10ms currency detection & gateway selection, <2s webhook order fulfillment  
**Constraints**: Strict HMAC/SHA signature verification on webhooks, atomic order status transitions  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Single Responsibility & Modular Design**: Isolated `PaymentController`, `IPaymentGateway` strategy implementations, and `SubscriptionCheckout` UI component.
- [x] **Loose Coupling & Interfaces**: Midtrans and Stripe encapsulated behind `IPaymentGateway` strategy interface per Principle II.
- [x] **Code Quality & SOLID**: Open for future gateway extensions (PayPal SDK, Xendit) without modifying core checkout service.
- [x] **Testing Standards**: API contract tests for `/api/payments/checkout` and webhook endpoints.
- [x] **UX & Frontend Integration**: Integrates directly into `SubscriptionCheckout.tsx` maintaining warm rose design aesthetics.
- [x] **Performance & Optimization**: Instant client-side currency formatters and lightweight webhook handlers.

## Project Structure

### Documentation (this feature)

```text
specs/003-pricing-localization-payments/
├── plan.md              # Implementation plan
├── research.md          # Technical decisions & research
├── data-model.md        # Entities & DTOs
├── quickstart.md        # Runnable validation guide
└── contracts/           # API contracts
    └── payment-api.md   # POST /api/payments/checkout & webhook specs
```

### Source Code

```text
backend/
├── Controllers/
│   └── PaymentController.cs
├── Services/
│   ├── IPaymentGateway.cs
│   ├── MidtransPaymentGateway.cs
│   ├── StripePaymentGateway.cs
│   └── LocalizationService.cs
└── Models/
    ├── Order.cs
    └── CheckoutRequestDto.cs

frontend/
├── src/
│   ├── SubscriptionCheckout.tsx
│   └── services/
│       └── paymentApi.ts
```

**Structure Decision**: Fullstack Web Application split between C# .NET Web API and React 19 Frontend.

## Complexity Tracking

*No violations of project constitution detected.*
