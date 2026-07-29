# System Architecture & Data Flows

**Document**: System Architecture, Internal/External Tech Stack, and Data Pipelines  
**File Location**: `docs/SYSTEM_ARCHITECTURE.md`  
**Date**: July 29, 2026  
**Status**: Approved Architecture  
**Related Documents**: [PRD.md](file:///d:/phanilie-new/PRD.md) | [BRD.md](file:///d:/phanilie-new/docs/BRD.md) | [specs/](file:///d:/phanilie-new/specs/)

---

## 1. Internal & External Technology Matrix

The **Phanilie Music Platform** architecture seamlessly connects internal backend services with external third-party services:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React + Vite)                               │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ REST API / JSON (HTTPS)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (C# / ASP.NET Core 10 Web API)                      │
│                                                                                  │
│  [JWT Auth & Middleware]  -->  [Controllers & Services]  -->  [EF Core 10 ORM]    │
│  [PDF Watermark Engine]   -->  [Geo-IP & Dual Currency]  -->  [Rate Limiter]       │
└──────────────┬─────────────────────────┬─────────────────────────┬───────────────┘
               │                         │                         │
               ▼                         ▼                         ▼
┌──────────────────────────┐ ┌───────────────────────┐ ┌──────────────────────────┐
│   DATABASE & STORAGE     │ │   PAYMENT GATEWAYS    │ │  COMMUNICATION SERVICES  │
│                          │ │                       │ │                          │
│  • PostgreSQL            │ │  • Midtrans (IDR)     │ │  • SendGrid / SMTP       │
│  • Supabase DB Cloud     │ │  • Stripe (USD)       │ │    (OTP, Reset Token,    │
│  • Supabase Media Bucket │ │                       │ │     Auto-Reply Emails)   │
└──────────────────────────┘ └───────────────────────┘ └──────────────────────────┘
```

### 1.1 Technology Specification Table

| Category | Technology | Type | Primary Role |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | **ASP.NET Core 10 Web API** | Internal | Business logic, REST API endpoints, routing, CORS, and security middleware. |
| **ORM / Data Access** | **Entity Framework Core 10 (`Npgsql`)** | Internal | Connects C# code to PostgreSQL (*Code-First Migrations* & encrypted queries). |
| **Database Engine** | **PostgreSQL** | Internal / Cloud | Relational data persistence (User, Order, Course, Lesson, SheetMusic, Progress, Badges). |
| **Cloud Database Host** | **Supabase DB** | External Cloud | Managed 24/7 PostgreSQL cloud database hosting. |
| **Media Object Storage** | **Supabase Storage / Local Disk** | Internal / External | Asset storage for Sheet Music PDFs, Cover images, and 30-second audio previews. |
| **PDF Processing** | **PdfSharpCore / iText7** | Internal Library | Dynamically stamps buyer name & email watermark onto PDF footers during download. |
| **Auth & Security** | **JWT Bearer & BCrypt.Net** | Internal | Issues authentication tokens, hashes passwords, and enforces Role-Based Access Control (RBAC). |
| **Payment Gateway IDR** | **Midtrans API & SNAP** | External API | Processes Indonesian Rupiah payments (QRIS, BCA, Mandiri, GoPay, OVO). |
| **Payment Gateway USD** | **Stripe API** | External API | Processes international USD payments (Credit Cards, Debit Cards, PayPal). |
| **Email Gateway** | **SendGrid / SMTP Server** | External Service | Dispatches email verification, OTP password reset tokens, and contact auto-replies. |

---

## 2. Visual System Flows (Mermaid Diagrams)

### 2.1 Authentication & Country Localization Flow

This diagram illustrates Geo-IP location detection, currency assignment, and secure JWT token issuance.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Client)
    participant FE as Frontend (React)
    participant BE as Backend (.NET 10 API)
    participant DB as Database (PostgreSQL)

    User->>FE: Open Page / Register
    FE->>BE: POST /api/auth/register (Name, Email, Password, CountryCode)
    Note over BE: Hash Password with BCrypt
    Note over BE: Determine Currency (IDR if 'ID', USD if non-'ID')
    BE->>DB: Save New User
    DB-->>BE: User Saved (ID: 101)
    BE->>BE: Generate JWT Access Token + Refresh Token
    BE-->>FE: Response 200 OK (Token, Role, CountryCode, Currency)
    FE-->>User: Render Regional UI (IDR/USD)
```

---

### 2.2 Freemium Course Exploration & Paywall Security Guard Flow

This diagram demonstrates how paid media content is secured at the backend API level.

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest / Free Student
    participant FE as Frontend (React)
    participant BE as Backend (.NET 10 API)
    participant AuthGuard as Paywall Authorization Guard

    Guest->>FE: Click 'Start Learning Now' -> Open /courses
    FE->>BE: GET /api/courses
    BE-->>FE: Return Course Tree (Levels, Topics, Lessons Metadata)
    FE-->>Guest: Render Public Lesson List

    Guest->>FE: Click Play Video / Download Lesson PDF
    FE->>BE: GET /api/lessons/{id}/media (Bearer Token)
    BE->>AuthGuard: Verify User Role Claims
    alt User Has Role 'Subscriber' / 'Admin'
        AuthGuard-->>BE: Authorized
        BE-->>FE: Stream Video / Serve PDF
        FE-->>Guest: Video Plays / PDF Downloads
    else User Role 'Guest' / 'Student' (Non-Subscriber)
        AuthGuard-->>BE: Unauthorized (403 Forbidden)
        BE-->>FE: Response 403 { "requires_membership": true, "plans": [...] }
        FE-->>Guest: Display 'Membership Plan' Upgrade Modal
    end
```

---

### 2.3 Sheet Music E-Commerce, Dual Gateway Webhook, & PDF Watermarking Flow

This diagram details the transaction flow from sheet music selection, Midtrans/Stripe payment processing, to downloading dynamically watermarked PDFs.

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Sheet Music Buyer
    participant FE as Frontend (React)
    participant BE as Backend (.NET 10 API)
    participant Gateway as Midtrans / Stripe Gateway
    participant DB as Database (PostgreSQL)
    participant PDFEngine as Dynamic PDF Watermark Engine

    Buyer->>FE: Add Sheet Music to Cart -> Checkout
    FE->>BE: POST /api/checkout/initiate (Items, Currency)
    alt Currency == IDR
        BE->>Gateway: Create Midtrans SNAP Transaction
        Gateway-->>BE: Snap Token / Redirect URL
    else Currency == USD
        BE->>Gateway: Create Stripe Checkout Session
        Gateway-->>BE: Stripe Session URL
    end
    BE-->>FE: Redirect to Gateway Payment Page
    Buyer->>Gateway: Complete Payment (QRIS / Credit Card)
    
    Note over Gateway: Payment Successful!
    Gateway->>BE: POST /api/webhooks/payment (Payment Webhook Confirmed)
    BE->>DB: Update Order Status = 'Paid' & Add Items to UserLibrary
    DB-->>BE: Saved

    Buyer->>FE: Open 'My Library' Menu
    FE->>BE: GET /api/my-library
    BE-->>FE: Return Purchased Sheet Music List
    
    Buyer->>FE: Click 'Download PDF'
    FE->>BE: GET /api/my-library/{id}/download
    BE->>DB: Fetch Buyer Details (Name & Email) & Master PDF
    BE->>PDFEngine: Process PDF (Stamp Buyer Name/Email Footer Watermark)
    PDFEngine-->>BE: Stream Watermarked PDF File
    BE-->>FE: Download PDF File
    FE-->>Buyer: Watermarked Sheet Music File Ready
```

---

### 2.4 Student Learning Board & Auto-Badge Trigger Flow

This diagram demonstrates how student learning progress is recorded and triggers badge auto-unlocks.

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Learning
    participant FE as Frontend (React)
    participant BE as Backend (.NET 10 API)
    participant DB as Database (PostgreSQL)
    participant BadgeEngine as Badge Auto-Trigger Service

    Student->>FE: Complete Lesson (Click 'Mark Complete')
    FE->>BE: POST /api/progress/complete (LessonId, PracticeMinutes)
    BE->>DB: Save New Progress & Update Weekly Practice Minutes
    
    BE->>BadgeEngine: Evaluate Badge Thresholds (e.g. Total Lessons >= 5)
    alt Milestone Reached & Badge Not Yet Awarded
        BadgeEngine->>DB: Unlock New Badge in UserBadges
        BadgeEngine-->>BE: New Badge Awarded!
        BE-->>FE: Response { "completed": true, "new_badge": "First 5 Songs Mastered" }
        FE-->>Student: Display Badge Celebration Pop-up! 🎉
    else Threshold Not Reached
        BE-->>FE: Response { "completed": true }
    end
```

---

## 3. Media Security & Delivery Pipeline

To ensure digital sheet music and course videos remain secure against piracy:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      MEDIA ASSETS PROTECTION PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  [1. Request Media]  ──►  [2. Validate JWT & Subscription Claims]               │
│                                           │                                     │
│                                           ▼                                     │
│  [4. Dynamic Injection] ◄── [3. Generate Temporary Signed URL (Expires in 5m)]  │
│       • PDF: Inject Footer Buyer Watermark Text                                 │
│       • Video: Stream HLS / Secure Byte Chunks                                  │
│                                           │                                     │
│                                           ▼                                     │
│  [5. Deliver Binary Stream directly to Client Browser (No Static Paths Exposed)]│
└─────────────────────────────────────────────────────────────────────────────────┘
```
